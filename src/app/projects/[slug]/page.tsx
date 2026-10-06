import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/content";
import { isPlaceholder } from "@/lib/site";
import { ImageFrame } from "@/components/ImageFrame";
import { Prose } from "@/components/Prose";
import { Suspense } from "react";
import { JmfDocket, JmfDocketLoading } from "@/components/projects/JmfDocket";

// Projects with a live section under their write-up, keyed by slug: [component, loading placeholder]
const live: Record<string, [() => Promise<React.ReactNode>, () => React.ReactNode] | undefined> = {
  "jmf-docket": [JmfDocket, JmfDocketLoading],
};

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => getProjects().map((p) => ({ slug: p.slug }));
export const dynamicParams = false;
// Rendered per request (behind the password anyway) so live data is never fetched during a deploy.
// The data itself is cached; see src/lib/courtlistener.ts.
export const dynamic = "force-dynamic";
// A first, uncached load walks ~20 pages of CourtListener results.
export const maxDuration = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, type: "website" },
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const links = project.links.filter((l) => !isPlaceholder(l.url));
  const [Live, Loading] = live[project.slug] ?? [];

  return (
    <article className="wrap pt-16 md:pt-28">
      <Link href="/projects" className="label link">← Projects</Link>
      <h1 className="display text-title mt-8">{project.title}</h1>

      <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-6 md:grid-cols-4">
        <div><dt className="label">Status</dt><dd className="capitalize">{project.status}</dd></div>
        <div><dt className="label">Year</dt><dd>{project.year}</dd></div>
        {links.length > 0 && (
          <div className="col-span-2">
            <dt className="label">Links</dt>
            <dd className="flex flex-wrap gap-x-5">
              {links.map((l) => (
                <a key={l.url} href={l.url} className="link" rel="noopener">{l.label} ↗</a>
              ))}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-12">
        <ImageFrame src={project.image} alt={project.imageAlt} ratio="16 / 9" priority sizes="(min-width: 1152px) 1100px, 100vw" />
      </div>

      <div className="mx-auto mt-16 max-w-2xl"><Prose source={project.body} /></div>

      {Live && Loading && (
        <Suspense fallback={<Loading />}>
          <Live />
        </Suspense>
      )}
    </article>
  );
}
