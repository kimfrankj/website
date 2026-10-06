// Refreshes the estimated procedural posture for a batch of the JMF Docket cases.
// Run a few times a day by .github/workflows/jmf-posture.yml.
//
// CourtListener's free API allows 5 requests/minute, 50/hour and 125/day. Each case costs one
// request, so each run checks only BATCH cases — new cases first, then the ones checked longest
// ago — and the whole docket rotates through every few days. If CourtListener rate-limits us,
// the run saves what it has and stops.
//
//   COURTLISTENER_TOKEN=... node scripts/fetch-jmf-posture.mjs

import { readFile, writeFile } from "node:fs/promises";
import { classify, entryText } from "./posture-rules.mjs";

const API = process.env.COURTLISTENER_ENTRIES_API ?? "https://www.courtlistener.com/api/rest/v4/docket-entries/";
const CASES = process.env.CASES ?? "data/jmf-docket.json";
const OUT = process.env.OUT ?? "data/jmf-posture.json";
const BATCH = Number(process.env.BATCH ?? 30);
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

async function latestEntries(docketId) {
  const url = new URL(API);
  url.search = new URLSearchParams({
    docket: String(docketId),
    order_by: "-date_filed,-entry_number",
    fields: "date_filed,entry_number,description,recap_documents__description",
  }).toString();
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(60_000) });
  if (res.status === 429) throw new RateLimited("CourtListener rate limit reached");
  if (!res.ok) throw new Error(`CourtListener answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).results ?? [];
}

const { cases = [] } = await readJson(CASES, {});
const saved = await readJson(OUT, { cases: {} });
const active = new Map(cases.map((c) => [String(c.id), c]));

// Forget cases that are no longer active.
const posture = Object.fromEntries(Object.entries(saved.cases ?? {}).filter(([id]) => active.has(id)));

// New cases first, then the ones checked longest ago.
const queue = [...active.keys()]
  .sort((a, b) => (posture[a]?.checkedAt ?? "").localeCompare(posture[b]?.checkedAt ?? ""))
  .slice(0, BATCH);

let checked = 0;
for (const [i, id] of queue.entries()) {
  if (i > 0) await sleep(PACE_MS);
  const c = active.get(id);
  try {
    const entries = await latestEntries(id);
    const top = entries[0];
    posture[id] = {
      checkedAt: new Date().toISOString(),
      stage: classify(entries, c.docketNumber.includes("-cr-")),
      latest: top ? { date: top.date_filed ?? null, number: top.entry_number ?? null, text: entryText(top).slice(0, 400) } : null,
    };
    checked++;
    console.log(`${c.docketNumber}  ${posture[id].stage}`);
  } catch (e) {
    if (e instanceof RateLimited) {
      console.log("Rate limited; saving progress and stopping.");
      break;
    }
    // Record the attempt so one bad case can't block the rotation; it will be retried in a few days.
    posture[id] = { ...(posture[id] ?? {}), checkedAt: new Date().toISOString(), error: e.message.slice(0, 200) };
    console.log(`${c.docketNumber}  error: ${e.message}`);
  }
}

await writeFile(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), cases: posture }, null, 2) + "\n");
const done = Object.values(posture).filter((p) => p.stage).length;
console.log(`Checked ${checked} this run; ${done} of ${active.size} active cases have a posture.`);
