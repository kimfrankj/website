import { getFurmanActiveDockets, type DocketList } from "@/lib/courtlistener";

const fmt = (d: string | null) =>
  d ? new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }) : "—";

/** Shown while the case list loads (the first load can take a minute). */
export function JmfDocketLoading() {
  return (
    <section className="mt-16 border-t border-line pt-6" aria-busy="true">
      <p className="label">Loading the active cases from CourtListener…</p>
    </section>
  );
}

/** Live table of the active cases on Judge Furman's docket. */
export async function JmfDocket() {
  let data: DocketList;
  try {
    data = await getFurmanActiveDockets();
  } catch (e) {
    return (
      <section className="mt-16 border-t border-line pt-6">
        <p role="status" className="text-accent">
          CourtListener didn’t respond in time{e instanceof Error ? ` (${e.message})` : ""}. Refresh the page in a minute.
        </p>
      </section>
    );
  }

  const { cases, fetchedAt } = data;
  const updated = new Date(fetchedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  return (
    <section aria-labelledby="docket-h" className="mt-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-6">
        <h2 id="docket-h" className="display text-3xl md:text-4xl">
          {cases.length.toLocaleString("en-US")} active cases
        </h2>
        <p className="label">Updated {updated} ET · Source: CourtListener</p>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="label py-3 pr-4 font-normal">Filed</th>
              <th scope="col" className="label py-3 pr-4 font-normal">Case</th>
              <th scope="col" className="label py-3 pr-4 font-normal">Docket</th>
              <th scope="col" className="label hidden py-3 font-normal md:table-cell">Nature of suit</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id} className="border-b border-line align-top">
                <td className="whitespace-nowrap py-3 pr-4 text-muted">{fmt(c.dateFiled)}</td>
                <td className="py-3 pr-4">
                  <a href={c.url} className="link" rel="noopener" target="_blank">{c.caseName}</a>
                </td>
                <td className="whitespace-nowrap py-3 pr-4 font-mono text-xs">{c.docketNumber}</td>
                <td className="hidden py-3 text-muted md:table-cell">{c.suitNature ?? c.cause ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
