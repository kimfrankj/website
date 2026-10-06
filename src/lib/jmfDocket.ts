import fs from "node:fs";
import path from "node:path";

/**
 * The saved list of active cases on Judge Furman's docket, written once a day by
 * scripts/fetch-jmf-docket.mjs (see .github/workflows/jmf-docket.yml). The site never calls
 * CourtListener itself: its free API allows only 5 requests a minute.
 */

export type Docket = {
  id: number;
  caseName: string;
  docketNumber: string;
  dateFiled: string | null;
  suitNature: string | null;
  cause: string | null;
  url: string;
};

export type DocketList = { fetchedAt: string; reported: number; cases: Docket[] };

export function getJmfDocket(): DocketList | null {
  const file = path.join(process.cwd(), "data", "jmf-docket.json");
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as DocketList;
}
