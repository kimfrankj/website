import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/content";
import { isPlaceholder } from "@/lib/site";
import { ImageFrame } from "@/components/ImageFrame";
import { Prose } from "@/components/Prose";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => getProjects().map((p) => ({ slug: p.slug }));
export const dynamicParams = false;

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

  return (
    <article className="wrap pt-10 md:pt-20">
      <Link href="/projects" className="label link">← Projects</Link>
      <h1 className="display text-title mt-8">{project.title}</h1>
      <p className="mt-6 max-w-2xl font-display text-[length:var(--text-lead)] leading-tight">{project.summary}</p>

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
        <ImageFrame
          src={project.image}
          alt={project.imageAlt}
          label={`Project image, 16:9. Set "image" in content/projects/${project.slug}.mdx`}
          ratio="16 / 9"
          priority
          sizes="100vw"
        />
      </div>

      <div className="mx-auto mt-16 max-w-2xl"><Prose source={project.body} /></div>
    </article>
  );
}
