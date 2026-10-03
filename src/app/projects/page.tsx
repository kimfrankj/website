import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { ProjectRow } from "@/components/ProjectRow";

export const metadata: Metadata = {
  title: "Projects",
  description: "Ventures and projects Frank Kim is building.",
};

export default function Projects() {
  const projects = getProjects();
  return (
    <div className="wrap pt-16 md:pt-28">
      <h1 className="display text-title mb-6">Projects</h1>
      <p className="mb-16 max-w-md text-muted md:mb-24">Ventures and experiments, from first idea to launch.</p>
      {projects.length === 0 && <p className="border-t border-line py-8 text-muted">Coming soon.</p>}
      {projects.map((p, i) => <ProjectRow key={p.slug} project={p} index={i} />)}
    </div>
  );
}
