import Link from "next/link";
import type { Entry } from "@/lib/content";
import type { ProjectMeta } from "@/lib/schema";
import { ImageFrame } from "./ImageFrame";
import { Reveal } from "./Reveal";

export function ProjectRow({ project, index, level = 2 }: { project: Entry<ProjectMeta>; index: number; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <Reveal>
      <Link href={`/projects/${project.slug}`} className="group block border-t border-line py-8 md:py-10">
        {project.image && (
          <div className="mb-8 overflow-hidden">
            <ImageFrame
              src={project.image}
              alt={project.imageAlt}
              ratio="16 / 8"
              sizes="(min-width: 1152px) 1100px, 100vw"
              className="transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
            />
          </div>
        )}
        <div className="grid gap-3 md:grid-cols-12 md:gap-6">
          <span className="label md:col-span-1 md:pt-2">{String(index + 1).padStart(2, "0")}</span>
          <Heading className="display text-2xl transition-colors group-hover:text-accent md:col-span-6 md:text-3xl">
            {project.title}
          </Heading>
          <p className="text-muted md:col-span-3">{project.summary}</p>
          <p className="label md:col-span-2 md:pt-2 md:text-right">{project.status} · {project.year}</p>
        </div>
      </Link>
    </Reveal>
  );
}
