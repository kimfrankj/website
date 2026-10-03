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
    <div className="wrap pt-10 md:pt-20">
      <h1 className="display text-title mb-6">Projects</h1>
      <p className="mb-20 max-w-xl text-lg text-muted">Ventures and experiments, from first idea to launch.</p>
      {projects.map((p, i) => <ProjectRow key={p.slug} project={p} index={i} />)}
    </div>
  );
}
