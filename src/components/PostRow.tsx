import Link from "next/link";
import { formatDate, type Post } from "@/lib/content";

/** One essay in the Writing list; the list sets the indent, angle and entrance (see `.index` in globals.css). */
export function PostRow({ post, index = 0, level = 2 }: { post: Post; index?: number; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <li style={{ "--i": index } as React.CSSProperties}>
      <Link data-node href={`/writing/${post.slug}`} className="index-link group flex-wrap">
        <time dateTime={post.date.toISOString()} className="label w-full font-sans">
          {formatDate(post.date)}
        </time>
        <Heading className="index-word display text-[length:clamp(1.75rem,3.6vw,3rem)]">{post.title}</Heading>
        <span aria-hidden="true" className="index-leader max-md:hidden" />
        <span className="label shrink-0 font-sans max-md:basis-full md:text-right">{post.readingMinutes} min</span>
      </Link>
    </li>
  );
}
