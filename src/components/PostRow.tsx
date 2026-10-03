import Link from "next/link";
import { formatDate, type Post } from "@/lib/content";

export function PostRow({ post }: { post: Post }) {
  return (
    <li className="border-t border-line">
      <Link href={`/writing/${post.slug}`} className="group grid gap-2 py-8 md:grid-cols-12 md:gap-6">
        <time dateTime={post.date.toISOString()} className="label md:col-span-3 md:pt-3">
          {formatDate(post.date)}
        </time>
        <div className="md:col-span-7">
          <h3 className="display text-3xl transition-colors group-hover:text-accent md:text-5xl">{post.title}</h3>
          <p className="mt-3 max-w-xl text-muted">{post.summary}</p>
        </div>
        <p className="label md:col-span-2 md:pt-3 md:text-right">
          {post.readingMinutes} min read
          {post.tags.length > 0 && <><br />{post.tags.join(", ")}</>}
        </p>
      </Link>
    </li>
  );
}
