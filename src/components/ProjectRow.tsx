import Link from "next/link";
import type { Entry } from "@/lib/content";
import type { ProjectMeta } from "@/lib/schema";
import { ImageFrame } from "./ImageFrame";
import { Reveal } from "./Reveal";

export function ProjectRow({ project, index }: { project: Entry<ProjectMeta>; index: number }) {
  return (
    <Reveal>
      <Link href={`/projects/${project.slug}`} className="group block border-t border-line pt-6 pb-12 md:pb-20">
        <div className="mb-5 flex items-baseline justify-between">
          <span className="label">{String(index + 1).padStart(2, "0")}</span>
          <span className="label">{project.status} · {project.year}</span>
        </div>
        <div className="overflow-hidden">
          <ImageFrame
            src={project.image}
            alt={project.imageAlt}
            label={`Project image, 16:10. Set "image" in content/projects/${project.slug}.mdx`}
            ratio="16 / 8"
            sizes="100vw"
            className="transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
          />
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-12">
          <h3 className="display text-4xl md:col-span-7 md:text-6xl">
            {project.title}
            <span aria-hidden="true" className="ml-3 inline-block text-accent transition-transform duration-500 group-hover:translate-x-2">→</span>
          </h3>
          <p className="max-w-md text-muted md:col-span-4 md:col-start-9">{project.summary}</p>
        </div>
      </Link>
    </Reveal>
  );
}
