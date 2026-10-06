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

export type Posture = {
  checkedAt: string;
  stage?: string;
  latest?: { date: string | null; number: number | null; text: string } | null;
  error?: string;
};

/** Estimated procedural posture per case (keyed by docket id), refreshed in rotation by scripts/fetch-jmf-posture.mjs. */
export function getJmfPosture(): Record<string, Posture> {
  const file = path.join(process.cwd(), "data", "jmf-posture.json");
  if (!fs.existsSync(file)) return {};
  return (JSON.parse(fs.readFileSync(file, "utf8")) as { cases: Record<string, Posture> }).cases ?? {};
}
