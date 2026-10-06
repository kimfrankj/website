import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/content";
import { ProjectArticle } from "@/components/ProjectArticle";
import { JmfDocket } from "@/components/projects/JmfDocket";

const SLUG = "jmf-docket";

export function generateMetadata(): Metadata {
  const project = getProject(SLUG);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${SLUG}` },
    openGraph: { title: project.title, description: project.summary, type: "website" },
  };
}

export default function JmfDocketPage() {
  const project = getProject(SLUG);
  if (!project) notFound();
  return (
    <ProjectArticle project={project}>
      <JmfDocket />
    </ProjectArticle>
  );
}
