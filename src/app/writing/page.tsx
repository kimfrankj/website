import type { Metadata } from "next";
import { getPosts } from "@/lib/content";
import { PostRow } from "@/components/PostRow";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays and articles by Frank Kim.",
};

export default function Writing() {
  const posts = getPosts();
  return (
    <div className="wrap pt-16 md:pt-28">
      <h1 className="display text-title mb-16 md:mb-24">Writing</h1>
      {posts.length === 0 ? <p className="border-t border-line py-8 text-muted">Coming soon.</p> : <ul>{posts.map((p) => <PostRow key={p.slug} post={p} />)}</ul>}
    </div>
  );
}
