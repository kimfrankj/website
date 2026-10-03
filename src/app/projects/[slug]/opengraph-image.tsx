import { getProject, getProjects } from "@/lib/content";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const generateStaticParams = () => getProjects().map((p) => ({ slug: p.slug }));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  return ogImage({ title: p?.title ?? "Project", kicker: "Project · Frank Kim" });
}
