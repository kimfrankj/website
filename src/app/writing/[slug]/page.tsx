import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost, getPosts } from "@/lib/content";
import { site } from "@/lib/site";
import { Prose } from "@/components/Prose";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => getPosts().map((p) => ({ slug: p.slug }));
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/writing/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date.toISOString(),
      authors: [site.name],
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.date.toISOString(),
    dateModified: (post.updated ?? post.date).toISOString(),
    author: { "@type": "Person", name: site.name },
  };

  return (
    <article className="wrap pt-10 md:pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Link href="/writing" className="label link">← Writing</Link>
      <h1 className="display text-title mt-8 max-w-5xl">{post.title}</h1>
      <p className="label mt-8 flex flex-wrap gap-x-6">
        <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
        <span>{post.readingMinutes} min read</span>
        {post.tags.length > 0 && <span>{post.tags.join(", ")}</span>}
      </p>
      <div className="mx-auto mt-16 max-w-2xl"><Prose source={post.body} /></div>
    </article>
  );
}
