import { getJmfDocket, getJmfPosture } from "@/lib/jmfDocket";

const fmt = (d: string | null | undefined) =>
  d ? new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }) : "—";

/** Table of the active cases on Judge Furman's docket, with an estimated posture for each. */
export function JmfDocket() {
  const data = getJmfDocket();

  if (!data) {
    return (
      <section className="mt-16 border-t border-line pt-6">
        <p className="text-muted">
          The case list hasn’t been fetched yet. It updates once a day; you can also run “Update JMF Docket” from
          the repository’s Actions tab on GitHub.
        </p>
      </section>
    );
  }

  const { cases, fetchedAt } = data;
  const posture = getJmfPosture();
  const withPosture = cases.filter((c) => posture[c.id]?.stage).length;
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
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Posture is an estimate read from each case’s most recent docket entries, refreshed about every four days.
        {withPosture < cases.length && ` ${withPosture} of ${cases.length} cases checked so far.`}
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="label py-3 pr-4 font-normal">Filed</th>
              <th scope="col" className="label py-3 pr-4 font-normal">Case</th>
              <th scope="col" className="label py-3 pr-4 font-normal">Posture (est.)</th>
              <th scope="col" className="label hidden py-3 font-normal md:table-cell">Latest activity</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => {
              const p = posture[c.id];
              return (
                <tr key={c.id} className="border-b border-line align-top">
                  <td className="whitespace-nowrap py-3 pr-4 text-muted">{fmt(c.dateFiled)}</td>
                  <td className="py-3 pr-4">
                    <a href={c.url} className="link" rel="noopener" target="_blank">{c.caseName}</a>
                    <div className="mt-1 text-xs text-muted">
                      <span className="font-mono">{c.docketNumber}</span>
                      {(c.suitNature ?? c.cause) && <> · {c.suitNature ?? c.cause}</>}
                    </div>
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4">{p?.stage ?? <span className="text-muted">Not checked yet</span>}</td>
                  <td className="hidden max-w-md py-3 text-muted md:table-cell">
                    {p?.latest ? (
                      <span title={p.latest.text} className="line-clamp-2">
                        <span className="text-ink">{fmt(p.latest.date)}</span> · {p.latest.text}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
