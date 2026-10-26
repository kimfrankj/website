import type { Metadata } from "next";
import { getPosts } from "@/lib/content";
import { PostRow } from "@/components/PostRow";
import { SidePicture } from "@/components/SidePicture";
import { Words } from "@/components/Words";
import { PageTitle } from "@/components/PageTitle";
import { Current } from "@/components/Current";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays and articles by Frank Kim.",
};

export default function Writing() {
  const posts = getPosts();

  return (
    <div className="wrap pt-[5vh] md:pt-[7vh]">
      {/* Same arrangement as About and Projects: title and content on the left, painted picture on the right */}
      <div className="grid grid-cols-12">
        <div className="legible relative z-10 col-[1/span_7] row-start-1 flex flex-col md:col-[1/span_6]">
          {/* The current threads down through the title and every entry */}
          <Current />
          <PageTitle text="Writing" />

          <div className="flex flex-1 flex-col justify-center py-[4vh]">
            {posts.length === 0 ? (
              <p className="words display text-[length:clamp(1.5rem,5.8vw,4.5rem)]"><Words text="Coming soon." delay={250} /></p>
            ) : (
              <ul className="index">{posts.map((p, i) => <PostRow key={p.slug} post={p} index={i} />)}</ul>
            )}
          </div>
        </div>

        <SidePicture
          src="/writing/painted-ladies.webp"
          size={[900, 1064]}
          alt="Painted view of San Francisco's Painted Ladies Victorian houses, with the city skyline behind a cypress tree"
          position="50% 50%"
        />
      </div>
    </div>
  );
}
