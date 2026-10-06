import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/content";
import { ProjectArticle } from "@/components/ProjectArticle";

type Props = { params: Promise<{ slug: string }> };

// Projects with their own route folder (e.g. app/projects/jmf-docket) are rendered there instead.
const OWN_ROUTE = new Set(["jmf-docket"]);

export const generateStaticParams = () =>
  getProjects()
    .filter((p) => !OWN_ROUTE.has(p.slug))
    .map((p) => ({ slug: p.slug }));
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
  return <ProjectArticle project={project} />;
}
