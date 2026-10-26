import Link from "next/link";
import type { Entry } from "@/lib/content";
import type { ProjectMeta } from "@/lib/schema";
import { ImageFrame } from "./ImageFrame";

/** One project in the Projects list; the list sets the indent, angle and entrance (see `.index` in globals.css). */
export function ProjectRow({ project, index, level = 2 }: { project: Entry<ProjectMeta>; index: number; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div style={{ "--i": index } as React.CSSProperties}>
      {project.image && (
        <div className="mb-4 overflow-hidden">
          <ImageFrame src={project.image} alt={project.imageAlt} ratio="16 / 8" sizes="(min-width: 1152px) 600px, 100vw" />
        </div>
      )}
      {/* On phones the note drops under the title, clear of the painting beside the list */}
      <Link data-node href={`/projects/${project.slug}`} className="index-link group max-md:flex-wrap">
        <span className="label font-sans">{String(index + 1).padStart(2, "0")}</span>
        <Heading className="index-word display text-[length:clamp(1.75rem,3.6vw,3rem)]">{project.title}</Heading>
        <span aria-hidden="true" className="index-leader max-md:hidden" />
        <span className="label shrink-0 whitespace-nowrap font-sans max-md:basis-full md:text-right">{project.status} · {project.year}</span>
      </Link>
    </div>
  );
}
