import { getPost, getPosts } from "@/lib/content";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const generateStaticParams = () => getPosts().map((p) => ({ slug: p.slug }));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  return ogImage({ title: p?.title ?? "Writing", kicker: "Writing · Frank Kim" });
}
