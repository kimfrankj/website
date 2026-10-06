import Link from "next/link";
import type { Entry } from "@/lib/content";
import type { ProjectMeta } from "@/lib/schema";
import { isPlaceholder } from "@/lib/site";
import { ImageFrame } from "./ImageFrame";
import { Prose } from "./Prose";

/** A project's page: title, status/year/links, image, write-up, then anything project-specific. */
export function ProjectArticle({ project, children }: { project: Entry<ProjectMeta>; children?: React.ReactNode }) {
  const links = project.links.filter((l) => !isPlaceholder(l.url));
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

      {children}
    </article>
  );
}
