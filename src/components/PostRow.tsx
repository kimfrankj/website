import Link from "next/link";
import { formatDate, type Post } from "@/lib/content";

export function PostRow({ post, level = 2 }: { post: Post; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <li className="border-t border-line">
      <Link href={`/writing/${post.slug}`} className="group grid gap-2 py-8 md:grid-cols-12 md:gap-6 md:py-10">
        <time dateTime={post.date.toISOString()} className="label md:col-span-3 md:pt-2">
          {formatDate(post.date)}
        </time>
        <div className="md:col-span-7">
          <Heading className="display text-2xl transition-colors group-hover:text-accent md:text-3xl">{post.title}</Heading>
          <p className="mt-3 max-w-xl text-muted">{post.summary}</p>
        </div>
        <p className="label md:col-span-2 md:pt-2 md:text-right">
          {post.readingMinutes} min read
          {post.tags.length > 0 && <><br />{post.tags.join(", ")}</>}
        </p>
      </Link>
    </li>
  );
}
