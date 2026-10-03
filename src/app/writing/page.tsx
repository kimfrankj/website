import type { Metadata } from "next";
import { getPosts } from "@/lib/content";
import { PostRow } from "@/components/PostRow";
import { SidePicture } from "@/components/SidePicture";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays and articles by Frank Kim.",
};

export default function Writing() {
  const posts = getPosts();

  return (
    <div className="wrap pt-16 md:pt-28">
      {/* Same arrangement as About and Projects: title and content on the left, painted picture on the right */}
      <div className="grid grid-cols-12">
        <div className="relative z-10 col-span-7 col-start-1 row-start-1 flex flex-col md:col-span-6">
          <h1 className="display text-title">Writing</h1>

          <div className="flex flex-1 flex-col justify-center py-10">
            {posts.length === 0 ? (
              <p className="display text-[length:clamp(1.5rem,5.8vw,4.5rem)]">Coming soon.</p>
            ) : (
              <ul>{posts.map((p) => <PostRow key={p.slug} post={p} />)}</ul>
            )}
          </div>
        </div>

        <SidePicture
          src="/writing/painted-ladies.webp"
          alt="Painted view of San Francisco's Painted Ladies Victorian houses, with the city skyline behind a cypress tree"
          position="50% 50%"
        />
      </div>
    </div>
  );
}
