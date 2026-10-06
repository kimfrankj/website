// Collects docket entries, parties and attorneys for the JMF Docket cases, and estimates each
// case's procedural posture. Run a few times a day by .github/workflows/jmf-posture.yml.
//
// CourtListener's free API allows 5 requests/minute, 50/hour and 125/day, so each run spends a
// fixed budget of requests on the most useful work first:
//   1. Cases never checked: newest docket entries (gives posture + latest activity)
//   2. Cases without parties/attorneys (or last fetched over a month ago): 2 requests each
//   3. Cases whose entry history is incomplete: older pages of entries
//   4. Everything else: re-check newest entries, longest-unchecked first
// Saved per case: data/jmf-entries/<id>.json and data/jmf-parties/<id>.json; summary in
// data/jmf-posture.json. If CourtListener rate-limits us, the run saves what it has and stops.
//
//   COURTLISTENER_TOKEN=... node scripts/fetch-jmf-posture.mjs

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { classify, entryText } from "./posture-rules.mjs";

const BASE = (process.env.COURTLISTENER_BASE ?? "https://www.courtlistener.com/api/rest/v4/").replace(/\/?$/, "/");
const CASES = process.env.CASES ?? "data/jmf-docket.json";
const OUT = process.env.OUT ?? "data/jmf-posture.json";
const ENTRIES_DIR = process.env.ENTRIES_DIR ?? "data/jmf-entries";
const PARTIES_DIR = process.env.PARTIES_DIR ?? "data/jmf-parties";
const BUDGET = Number(process.env.BUDGET ?? 30); // requests per run
const PACE_MS = Number(process.env.PACE_MS ?? 13_000); // ≤ 5 requests per minute
const PARTIES_MAX_AGE_DAYS = 30;
const TOKEN = process.env.COURTLISTENER_TOKEN;

if (!TOKEN) {
  console.error("COURTLISTENER_TOKEN is not set.");
  process.exit(1);
}

const headers = {
  Authorization: `Token ${TOKEN}`,
  "User-Agent": "frankjkim.com JMF Docket (personal research project)",
  Accept: "application/json",
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const readJson = async (f, fallback) => {
  try {
    return JSON.parse(await readFile(f, "utf8"));
  } catch {
    return fallback;
  }
};

class RateLimited extends Error {}

let requests = 0;
async function get(url) {
  if (requests > 0) await sleep(PACE_MS);
  requests++;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(60_000) });
  if (res.status === 429) throw new RateLimited("CourtListener rate limit reached");
  if (!res.ok) throw Object.assign(new Error(`CourtListener answered ${res.status}: ${(await res.text()).slice(0, 200)}`), { status: res.status });
  return res.json();
}

const endpoint = (path, params) => {
  const url = new URL(path, BASE);
  url.search = new URLSearchParams(params).toString();
  return url.toString();
};

const newestEntriesUrl = (id) =>
  endpoint("docket-entries/", {
    docket: String(id),
    order_by: "-date_filed,-entry_number",
    fields: "id,date_filed,entry_number,description,recap_documents__description",
    page_size: "100", // ignored if the API doesn't allow it
  });

// CourtListener's attorney role codes
const ROLE = {
  1: "Attorney to be noticed",
  2: "Lead attorney",
  3: "Attorney in sealed group",
  4: "Pro hac vice",
  5: "Self-terminated",
  6: "Terminated",
  7: "Suspended",
  8: "Inactive",
  9: "Disbarred",
  10: null, // unknown
};

const toEntry = (e) => ({ id: e.id, date: e.date_filed ?? null, number: e.entry_number ?? null, text: entryText(e).slice(0, 1500) });

const entriesFile = (id) => `${ENTRIES_DIR}/${id}.json`;
const partiesFile = (id) => `${PARTIES_DIR}/${id}.json`;
const loadEntries = (id) => readJson(entriesFile(id), { complete: false, nextUrl: null, entries: [] });
const saveEntries = (id, h) => writeFile(entriesFile(id), JSON.stringify(h, null, 1) + "\n");

const { cases = [] } = await readJson(CASES, {});
const saved = await readJson(OUT, { cases: {} });
const active = new Map(cases.map((c) => [String(c.id), c]));
await mkdir(ENTRIES_DIR, { recursive: true });
await mkdir(PARTIES_DIR, { recursive: true });

// Forget cases that are no longer active (their files are left in place, harmlessly).
const posture = Object.fromEntries(Object.entries(saved.cases ?? {}).filter(([id]) => active.has(id)));

function updatePosture(id, h) {
  const c = active.get(id);
  const top = h.entries[0];
  posture[id] = {
    ...posture[id],
    checkedAt: new Date().toISOString(),
    stage: classify(
      h.entries.map((e) => ({ description: e.text })),
      c.docketNumber.includes("-cr-"),
    ),
    latest: top ? { date: top.date, number: top.number, text: top.text.slice(0, 400) } : null,
    lastFiling: top?.date ?? null,
    entries: h.entries.length,
    complete: h.complete,
  };
  delete posture[id].error;
}

// ---- tasks ------------------------------------------------------------------

async function checkNewest(id) {
  const h = await loadEntries(id);
  const page = await get(newestEntriesUrl(id));
  const fresh = (page.results ?? []).map(toEntry);
  const known = new Set(h.entries.map((e) => e.id));
  const overlaps = fresh.some((e) => known.has(e.id));
  if (!h.entries.length || (!overlaps && page.next)) {
    // First look at this case, or so much new activity that there is a gap: start the history over.
    Object.assign(h, { entries: fresh, nextUrl: page.next ?? null, complete: !page.next });
  } else {
    h.entries = [...fresh.filter((e) => !known.has(e.id)), ...h.entries];
  }
  await saveEntries(id, h);
  updatePosture(id, h);
  return `${posture[id].stage} (${h.entries.length} entries${h.complete ? "" : ", more to fetch"})`;
}

async function backfill(id) {
  const h = await loadEntries(id);
  if (h.complete || !h.nextUrl) return "nothing to do";
  let page;
  try {
    page = await get(h.nextUrl);
  } catch (e) {
    if (e.status === 400 || e.status === 404) {
      // A stale page link: start this case's history over on its next check.
      // (Auth errors like 401/403 are not this; they fall through and keep the history.)
      Object.assign(h, { entries: [], nextUrl: null, complete: false });
      await saveEntries(id, h);
      delete posture[id];
      return "history reset";
    }
    throw e;
  }
  const known = new Set(h.entries.map((e) => e.id));
  h.entries.push(...(page.results ?? []).map(toEntry).filter((e) => !known.has(e.id)));
  h.nextUrl = page.next ?? null;
  h.complete = !page.next;
  await saveEntries(id, h);
  updatePosture(id, h);
  return `${h.entries.length} entries${h.complete ? " (complete)" : ""}`;
}

async function fetchParties(id) {
  const parties = await get(
    endpoint("parties/", {
      docket: String(id),
      filter_nested_results: "True",
      fields: "id,name,party_types__name,party_types__date_terminated,attorneys__attorney_id,attorneys__role",
      page_size: "100",
    }),
  );
  const attorneys = await get(
    endpoint("attorneys/", {
      docket: String(id),
      filter_nested_results: "True",
      fields: "id,name,contact_raw",
      page_size: "100",
    }),
  );
  const byId = new Map((attorneys.results ?? []).map((a) => [a.id, a]));
  const record = {
    fetchedAt: new Date().toISOString(),
    more: Boolean(parties.next || attorneys.next), // very large cases: the rest is on CourtListener
    parties: (parties.results ?? []).map((p) => ({
      name: p.name,
      roles: (p.party_types ?? []).map((t) => ({ name: t.name, terminated: t.date_terminated ?? null })),
      attorneys: (p.attorneys ?? []).map((link) => {
        const a = byId.get(link.attorney_id);
        return {
          name: a?.name ?? null,
          role: ROLE[link.role] ?? null,
          contact: a?.contact_raw?.trim() || null,
        };
      }).filter((a) => a.name),
    })),
  };
  await writeFile(partiesFile(id), JSON.stringify(record, null, 1) + "\n");
  posture[id] = { ...(posture[id] ?? {}), partiesAt: record.fetchedAt };
  return `${record.parties.length} parties, ${byId.size} attorneys`;
}

// ---- plan -------------------------------------------------------------------

const ids = [...active.keys()];
const daysSince = (iso) => (iso ? (Date.now() - Date.parse(iso)) / 86_400_000 : Infinity);
const plan = [
  ...ids.filter((id) => !posture[id]).map((id) => ["newest", id, 1]), // never attempted
  ...ids
    .filter((id) => posture[id]?.stage && daysSince(posture[id].partiesAt) > PARTIES_MAX_AGE_DAYS)
    .sort((a, b) => (posture[a].partiesAt ?? "").localeCompare(posture[b].partiesAt ?? ""))
    .map((id) => ["parties", id, 2]),
  ...ids.filter((id) => posture[id]?.stage && !posture[id].complete).map((id) => ["backfill", id, 1]),
  ...ids // routine re-checks, including earlier failures, longest-unchecked first
    .filter((id) => posture[id])
    .sort((a, b) => (posture[a].checkedAt ?? "").localeCompare(posture[b].checkedAt ?? ""))
    .map((id) => ["newest", id, 1]),
];

const run = { newest: checkNewest, backfill, parties: fetchParties };
const counts = { newest: 0, backfill: 0, parties: 0 };
const done = new Set();

for (const [kind, id, cost] of plan) {
  if (requests + cost > BUDGET) continue; // a cheaper task may still fit
  const key = `${kind}:${id}`;
  if (done.has(key)) continue; // e.g. a case already re-checked earlier this run
  done.add(key);
  const c = active.get(id);
  try {
    const msg = await run[kind](id);
    counts[kind]++;
    console.log(`${c.docketNumber}  ${kind}: ${msg}`);
  } catch (e) {
    if (e instanceof RateLimited) {
      console.log("Rate limited; saving progress and stopping.");
      break;
    }
    // Record the attempt so one bad case can't block the queue; it will be retried later.
    if (kind === "newest") posture[id] = { ...(posture[id] ?? {}), checkedAt: new Date().toISOString(), error: e.message.slice(0, 200) };
    if (kind === "parties") posture[id] = { ...(posture[id] ?? {}), partiesAt: new Date().toISOString(), partiesError: e.message.slice(0, 200) };
    console.log(`${c.docketNumber}  ${kind} error: ${e.message}`);
  }
  if (requests >= BUDGET) break;
}

await writeFile(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), cases: posture }, null, 2) + "\n");
const all = Object.values(posture);
console.log(
  `Used ${requests} requests (${counts.newest} newest, ${counts.parties} parties, ${counts.backfill} backfill). ` +
    `${all.filter((p) => p.stage).length}/${active.size} have a posture, ` +
    `${all.filter((p) => p.partiesAt && !p.partiesError).length} have parties, ` +
    `${all.filter((p) => p.complete).length} have full histories.`,
);
