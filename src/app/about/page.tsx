import type { Metadata } from "next";
import { ImageFrame } from "@/components/ImageFrame";

export const metadata: Metadata = {
  title: "About",
  description: "About Frank Kim.",
};

export default function About() {
  return (
    <div className="wrap pt-16 md:pt-28">
      <h1 className="display text-title">About</h1>

      <div className="mt-16 grid gap-16 md:mt-24 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <p className="display text-[length:var(--text-hero)]">Frolicking through life.</p>

          <dl className="ruled ruled-last mt-16 grid max-w-xl grid-cols-3 gap-4 py-6 md:mt-24">
            <dt className="label pt-1">Currently</dt>
            <dd className="col-span-2">
              New Haven &amp; New York.
              <br />
              Building something new.
            </dd>
          </dl>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <ImageFrame
            src="/about/portrait-painted.jpg"
            alt="Painted portrait of Frank Kim leaning against a stone archway with arms crossed"
            ratio="2 / 3"
            priority
            sizes="(min-width: 768px) 30vw, 100vw"
          />
        </div>
      </div>
    </div>
  );
}
