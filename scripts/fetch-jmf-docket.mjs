// Fetches the active cases on Judge Jesse M. Furman's S.D.N.Y. docket from CourtListener and
// writes them to data/jmf-docket.json. Run daily by .github/workflows/jmf-docket.yml.
//
// CourtListener's free API limits are tight (5 requests/minute, 50/hour, 125/day), so this walks
// the ~20 result pages slowly, honours Retry-After, and never overwrites the saved list on failure.
//
//   COURTLISTENER_TOKEN=... node scripts/fetch-jmf-docket.mjs

import { mkdir, writeFile } from "node:fs/promises";

const API = process.env.COURTLISTENER_API ?? "https://www.courtlistener.com/api/rest/v4/search/";
const OUT = process.env.OUT ?? "data/jmf-docket.json";
const PACE_MS = Number(process.env.PACE_MS ?? 13_000); // ≤ 5 requests per minute
const MAX_PAGES = 40; // 20 results per page; a safety stop well above today's ~20 pages
const TOKEN = process.env.COURTLISTENER_TOKEN;

if (!TOKEN) {
  console.error("COURTLISTENER_TOKEN is not set.");
  process.exit(1);
}

const headers = {
  Authorization: `Token ${TOKEN}`,
  // CourtListener drops requests that don't identify themselves
  "User-Agent": "frankjkim.com JMF Docket (personal research project)",
  Accept: "application/json",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getPage(url) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(60_000) });
    if (res.ok) return res.json();
    if (res.status === 429 && attempt < 3) {
      const wait = Math.min(Number(res.headers.get("retry-after")) || 65, 300);
      console.log(`  rate limited; waiting ${wait}s`);
      await sleep(wait * 1000);
      continue;
    }
    throw new Error(`CourtListener answered ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

const first = new URL(API);
first.search = new URLSearchParams({
  type: "d",
  court: "nysd",
  // Exclude closed cases in the query itself; results are re-checked below because the index can lag.
  q: 'assignedTo:"Furman" -dateTerminated:*',
  order_by: "dateFiled desc",
}).toString();

const seen = new Map();
let url = first.toString();
let pages = 0;
let reported = 0;
while (url) {
  if (pages >= MAX_PAGES) throw new Error("More result pages than expected; stopping.");
  if (pages > 0) await sleep(PACE_MS);
  const page = await getPage(url);
  if (pages === 0) reported = page.count;
  for (const r of page.results) {
    if (r.dateTerminated || seen.has(r.docket_id)) continue;
    seen.set(r.docket_id, {
      id: r.docket_id,
      caseName: r.caseName,
      docketNumber: r.docketNumber,
      dateFiled: r.dateFiled ?? null,
      suitNature: r.suitNature || null,
      cause: r.cause || null,
      url: `https://www.courtlistener.com${r.docket_absolute_url}`,
    });
  }
  pages++;
  console.log(`page ${pages}: ${seen.size} active so far`);
  url = page.next;
}

const cases = [...seen.values()].sort((a, b) => (b.dateFiled ?? "").localeCompare(a.dateFiled ?? ""));
if (cases.length === 0) throw new Error("No cases returned; keeping the previous list.");

await mkdir(OUT.split("/").slice(0, -1).join("/") || ".", { recursive: true });
await writeFile(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), reported, cases }, null, 2) + "\n");
console.log(`Wrote ${cases.length} active cases (${reported} matched the search) to ${OUT}`);
