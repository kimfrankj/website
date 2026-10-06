// Collects docket entries for the JMF Docket cases and estimates each case's procedural posture.
// Run a few times a day by .github/workflows/jmf-posture.yml.
//
// CourtListener's free API allows 5 requests/minute, 50/hour and 125/day, and returns a limited
// number of entries per request. So each run spends a fixed budget of requests:
//   1. Rotation: re-check the newest entries of the cases checked longest ago (new cases first).
//   2. Backfill: with whatever is left, walk further back through cases whose history is incomplete.
// Entries are saved per case in data/jmf-entries/<docket id>.json; the estimated stage and latest
// activity go in data/jmf-posture.json. If CourtListener rate-limits us, the run saves and stops.
//
//   COURTLISTENER_TOKEN=... node scripts/fetch-jmf-posture.mjs

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { classify, entryText } from "./posture-rules.mjs";

const API = process.env.COURTLISTENER_ENTRIES_API ?? "https://www.courtlistener.com/api/rest/v4/docket-entries/";
const CASES = process.env.CASES ?? "data/jmf-docket.json";
const OUT = process.env.OUT ?? "data/jmf-posture.json";
const ENTRIES_DIR = process.env.ENTRIES_DIR ?? "data/jmf-entries";
const BUDGET = Number(process.env.BUDGET ?? 30); // requests per run
const BACKFILL_SHARE = Number(process.env.BACKFILL_SHARE ?? 10); // of those, reserved for backfill while histories are incomplete
const PACE_MS = Number(process.env.PACE_MS ?? 13_000); // ≤ 5 requests per minute
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

function newestUrl(docketId) {
  const url = new URL(API);
  url.search = new URLSearchParams({
    docket: String(docketId),
    order_by: "-date_filed,-entry_number",
    fields: "id,date_filed,entry_number,description,recap_documents__description",
    page_size: "100", // ignored if the API doesn't allow it; then pages hold 20 entries
  }).toString();
  return url.toString();
}

const toEntry = (e) => ({ id: e.id, date: e.date_filed ?? null, number: e.entry_number ?? null, text: entryText(e).slice(0, 1500) });

const entriesFile = (id) => `${ENTRIES_DIR}/${id}.json`;
const loadEntries = (id) => readJson(entriesFile(id), { complete: false, nextUrl: null, entries: [] });
const saveEntries = (id, h) => writeFile(entriesFile(id), JSON.stringify(h, null, 1) + "\n");

const { cases = [] } = await readJson(CASES, {});
const saved = await readJson(OUT, { cases: {} });
const active = new Map(cases.map((c) => [String(c.id), c]));
await mkdir(ENTRIES_DIR, { recursive: true });

// Forget cases that are no longer active (their entry files are left in place, harmlessly).
const posture = Object.fromEntries(Object.entries(saved.cases ?? {}).filter(([id]) => active.has(id)));

function updatePosture(id, h) {
  const c = active.get(id);
  const top = h.entries[0];
  posture[id] = {
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
}

// Cases fetched successfully at least once whose history still has older pages.
const incomplete = () => [...active.keys()].filter((id) => posture[id]?.stage && !posture[id].complete);
const backfillWanted = incomplete().length > 0 || [...active.keys()].some((id) => !posture[id]);
const rotateBudget = backfillWanted ? BUDGET - BACKFILL_SHARE : BUDGET;

// New cases first, then the ones checked longest ago.
const rotation = [...active.keys()]
  .sort((a, b) => (posture[a]?.checkedAt ?? "").localeCompare(posture[b]?.checkedAt ?? ""))
  .slice(0, rotateBudget);

let rateLimited = false;
let rotated = 0;
let backfilled = 0;

async function step(label, fn) {
  try {
    await fn();
    return true;
  } catch (e) {
    if (e instanceof RateLimited) {
      console.log("Rate limited; saving progress and stopping.");
      rateLimited = true;
      return false;
    }
    console.log(`${label}  error: ${e.message}`);
    return true;
  }
}

// 1. Rotation: newest page for each case
for (const id of rotation) {
  if (rateLimited || requests >= BUDGET) break;
  const c = active.get(id);
  const ok = await step(c.docketNumber, async () => {
    const h = await loadEntries(id);
    const page = await get(newestUrl(id));
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
    rotated++;
    console.log(`${c.docketNumber}  ${posture[id].stage}  (${h.entries.length} entries${h.complete ? "" : ", more to fetch"})`);
  });
  if (!ok) break;
  if (!posture[id]) posture[id] = { checkedAt: new Date().toISOString(), error: "fetch failed" };
}

// 2. Backfill: older pages for cases whose history is incomplete
for (const id of incomplete()) {
  if (rateLimited || requests >= BUDGET) break;
  const c = active.get(id);
  const h = await loadEntries(id);
  while (!h.complete && h.nextUrl && requests < BUDGET && !rateLimited) {
    const ok = await step(c.docketNumber, async () => {
      let page;
      try {
        page = await get(h.nextUrl);
      } catch (e) {
        if (e.status >= 400 && e.status < 500) {
          // A stale page link: start this case's history over on its next rotation.
          Object.assign(h, { entries: [], nextUrl: null, complete: false });
          delete posture[id];
          return;
        }
        throw e;
      }
      const known = new Set(h.entries.map((e) => e.id));
      const older = (page.results ?? []).map(toEntry).filter((e) => !known.has(e.id));
      h.entries.push(...older);
      h.nextUrl = page.next ?? null;
      h.complete = !page.next;
      backfilled++;
    });
    if (!ok || !h.nextUrl) break;
  }
  await saveEntries(id, h);
  if (posture[id]) updatePosture(id, h);
  console.log(`${c.docketNumber}  backfill: ${h.entries.length} entries${h.complete ? " (complete)" : ""}`);
}

await writeFile(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), cases: posture }, null, 2) + "\n");
const withStage = Object.values(posture).filter((p) => p.stage).length;
const complete = Object.values(posture).filter((p) => p.complete).length;
console.log(`Used ${requests} requests (${rotated} rotation, ${backfilled} backfill). ${withStage}/${active.size} cases have a posture; ${complete} have full histories.`);
