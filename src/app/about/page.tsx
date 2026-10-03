import type { Metadata } from "next";
import { site } from "@/lib/site";
import { ImageFrame } from "@/components/ImageFrame";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "Frank Kim is a student at Yale Law School interested in emerging technology and startups.",
};

export default function About() {
  return (
    <div className="wrap pt-10 md:pt-20">
      <h1 className="display text-title">About</h1>

      <div className="mt-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <ImageFrame
            label="Portrait, 4:5. Replace with /public/about/portrait.jpg"
            ratio="4 / 5"
            priority
            sizes="(min-width: 768px) 40vw, 100vw"
          />
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <p className="font-display text-[length:var(--text-lead)] leading-tight">{site.intro}</p>

          {/* Replace the bracketed paragraphs with your story. Long form is welcome. */}
          <div className="prose prose-site mt-12 max-w-none">
            <p>[BIO — where you grew up, what shaped you, what pulled you toward law.]</p>
            <p>[BIO — how you came to technology, and the problems you can’t stop thinking about.]</p>
            <p>[BIO — what you’re building now and what you hope to build next.]</p>
          </div>
        </div>
      </div>

      <Reveal className="mt-24 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <ImageFrame label="Second photo, 3:2. Optional" ratio="3 / 2" />
        </div>
        <div className="md:col-span-5 md:col-start-8 md:self-end">
          <p className="label mb-2">Currently</p>
          <p>Yale Law School. [Add anything else you want here.]</p>
        </div>
      </Reveal>
    </div>
  );
}
