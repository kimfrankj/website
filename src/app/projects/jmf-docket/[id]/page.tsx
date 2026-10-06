import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJmfDocket, getJmfEntries, getJmfPosture } from "@/lib/jmfDocket";

type Props = { params: Promise<{ id: string }> };

export const generateStaticParams = () => (getJmfDocket()?.cases ?? []).map((c) => ({ id: String(c.id) }));
export const dynamicParams = false;

const findCase = (id: string) => getJmfDocket()?.cases.find((c) => String(c.id) === id);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = findCase((await params).id);
  return c ? { title: `${c.caseName} · JMF Docket`, robots: { index: false, follow: false } } : {};
}

const day = (d: string | null | undefined) =>
  d ? new Date(`${d.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }) : null;
const moment = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York" }) + " ET" : null;

/** One case: the docket header (as on CourtListener) and every docket entry collected so far. */
export default async function CasePage({ params }: Props) {
  const { id } = await params;
  const c = findCase(id);
  if (!c) notFound();
  const p = getJmfPosture()[id];
  const history = getJmfEntries(id);

  const facts: [string, React.ReactNode][] = [
    ["Last updated", moment(c.lastUpdated)],
    ["Assigned to", c.assignedTo],
    ["Referred to", c.referredTo],
    ["Citation", `${c.caseName}, ${c.docketNumber}, (${c.courtCitation ?? "S.D.N.Y."})`],
    ["Date filed", day(c.dateFiled)],
    ["Date of last known filing", day(p?.lastFiling)],
    ["Cause", c.cause],
    ["Nature of suit", c.suitNature],
    ["Jury demand", c.juryDemand],
    ["Jurisdiction type", c.jurisdictionType],
    ["Posture (est.)", p?.stage],
    ["Parties", c.parties?.length ? c.parties.join("; ") : null],
    ["Attorneys", c.attorneys?.length ? c.attorneys.join("; ") : null],
    ["Firms", c.firms?.length ? c.firms.join("; ") : null],
  ];

  return (
    <article className="wrap pt-16 md:pt-28">
      <Link href="/projects/jmf-docket" className="label link">← JMF Docket</Link>
      <h1 className="display mt-8 max-w-4xl text-[length:var(--text-lead)] leading-tight md:text-4xl">{c.caseName}</h1>
      <p className="mt-3 text-sm text-muted">
        <span className="font-mono">{c.docketNumber}</span> ·{" "}
        <a href={c.url} className="link" rel="noopener" target="_blank">View on CourtListener ↗</a>
      </p>

      <dl className="mt-10 border-t border-line">
        {facts
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="grid gap-1 border-b border-line py-3 sm:grid-cols-4 sm:gap-6">
              <dt className="label sm:pt-0.5">{k}</dt>
              <dd className="text-sm sm:col-span-3">{v}</dd>
            </div>
          ))}
      </dl>

      <section aria-labelledby="entries-h" className="mt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="entries-h" className="display text-3xl">Docket entries</h2>
          {history && (
            <p className="label">
              {history.entries.length.toLocaleString("en-US")} {history.entries.length === 1 ? "entry" : "entries"}
              {!history.complete && " so far · older entries still being collected"}
            </p>
          )}
        </div>

        {!history ? (
          <p className="mt-6 text-muted">Docket entries for this case haven’t been collected yet. They’re added a few cases at a time.</p>
        ) : history.entries.length === 0 ? (
          <p className="mt-6 text-muted">CourtListener has no docket entries for this case yet.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="label py-3 pr-4 font-normal">Date</th>
                  <th scope="col" className="label py-3 pr-4 font-normal">#</th>
                  <th scope="col" className="label py-3 font-normal">Description</th>
                </tr>
              </thead>
              <tbody>
                {history.entries.map((e) => (
                  <tr key={e.id} className="border-b border-line align-top">
                    <td className="whitespace-nowrap py-3 pr-4 text-muted">{day(e.date) ?? "—"}</td>
                    <td className="py-3 pr-4 font-mono text-xs">{e.number ?? ""}</td>
                    <td className="py-3">{e.text || <span className="text-muted">(no description)</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </article>
  );
}
