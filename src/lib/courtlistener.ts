import { unstable_cache } from "next/cache";

/**
 * Active cases on Judge Jesse M. Furman's docket (S.D.N.Y.), from CourtListener's search API.
 *
 * "Active" means CourtListener has no termination date for the docket. Its data comes from PACER
 * via RECAP, so a case can show as active for a while after it actually closes.
 */

const API = "https://www.courtlistener.com/api/rest/v4/search/";
const REFRESH_SECONDS = 6 * 60 * 60; // the saved list is refreshed in the background at most every 6 hours
const MAX_PAGES = 40; // 20 results per page; a safety stop well above today's ~20 pages
const PAGE_TIMEOUT_MS = 30_000;
const TRIES = 3;

export type Docket = {
  id: number;
  caseName: string;
  docketNumber: string;
  dateFiled: string | null;
  suitNature: string | null;
  cause: string | null;
  url: string;
};

export type DocketList = { cases: Docket[]; fetchedAt: string };

type SearchResult = {
  docket_id: number;
  caseName: string;
  docketNumber: string;
  dateFiled: string | null;
  dateTerminated: string | null;
  suitNature?: string | null;
  cause?: string | null;
  docket_absolute_url: string;
};

type SearchPage = { next: string | null; results: SearchResult[] };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getPage(url: string, headers: Record<string, string>): Promise<SearchPage> {
  let last: unknown;
  for (let attempt = 1; attempt <= TRIES; attempt++) {
    try {
      const res = await fetch(url, { headers, cache: "no-store", signal: AbortSignal.timeout(PAGE_TIMEOUT_MS) });
      if (res.ok) return (await res.json()) as SearchPage;
      last = new Error(`CourtListener answered ${res.status}`);
      if (res.status !== 429 && res.status < 500) break; // not worth retrying
    } catch (e) {
      last = e;
    }
    await sleep(1500 * attempt);
  }
  throw last instanceof Error ? last : new Error("Could not reach CourtListener");
}

/** Walks every page of results. Throws if any page fails, so a partial list is never saved. */
async function crawl(): Promise<DocketList> {
  const headers: Record<string, string> = {
    // CourtListener drops requests that don't identify themselves
    "User-Agent": "frankjkim.com JMF Docket (personal research project)",
    Accept: "application/json",
  };
  const token = process.env.COURTLISTENER_TOKEN;
  if (token) headers.Authorization = `Token ${token}`;

  const first = new URL(API);
  first.search = new URLSearchParams({
    type: "d",
    court: "nysd",
    // Exclude closed cases in the query itself; results are re-checked below because the index can lag.
    q: 'assignedTo:"Furman" -dateTerminated:*',
    order_by: "dateFiled desc",
  }).toString();

  const seen = new Map<number, Docket>();
  let url: string | null = first.toString();
  for (let pages = 0; url; pages++) {
    if (pages >= MAX_PAGES) throw new Error("More pages than expected");
    const page = await getPage(url, headers);
    for (const r of page.results) {
      if (r.dateTerminated || seen.has(r.docket_id)) continue;
      seen.set(r.docket_id, {
        id: r.docket_id,
        caseName: r.caseName,
        docketNumber: r.docketNumber,
        dateFiled: r.dateFiled,
        suitNature: r.suitNature || null,
        cause: r.cause || null,
        url: `https://www.courtlistener.com${r.docket_absolute_url}`,
      });
    }
    url = page.next;
  }

  const cases = [...seen.values()].sort((a, b) => (b.dateFiled ?? "").localeCompare(a.dateFiled ?? ""));
  return { cases, fetchedAt: new Date().toISOString() };
}

/**
 * The saved list. Visitors get the saved copy instantly; once it is older than REFRESH_SECONDS,
 * a fresh crawl runs in the background. A failed crawl is not saved, so the last good list stays.
 */
export const getFurmanActiveDockets = unstable_cache(crawl, ["jmf-docket", "v1"], {
  revalidate: REFRESH_SECONDS,
  tags: ["jmf-docket"],
});
