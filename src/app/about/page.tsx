import type { Metadata } from "next";
import { ImageFrame } from "@/components/ImageFrame";

export const metadata: Metadata = {
  title: "About",
  description: "About Frank Kim.",
};

export default function About() {
  return (
    <div className="wrap pt-16 md:pt-28">
      <div className="grid gap-16 md:grid-cols-12 md:gap-8">
        {/* Text hangs from the top and sits at the bottom of the portrait's height */}
        <div className="flex flex-col justify-between gap-16 md:col-span-6">
          <h1 className="display text-title">About</h1>

          <div>
            <p className="display text-[length:var(--text-hero)]">Frolicking through life.</p>

            <dl className="ruled ruled-last mt-12 grid max-w-md grid-cols-3 gap-4 py-6 md:mt-16">
              <dt className="label pt-1">Currently</dt>
              <dd className="col-span-2">
                New Haven &amp; New York.
                <br />
                Building something new.
              </dd>
            </dl>
          </div>
        </div>

        {/* Portrait is dropped lower than the heading, with an offset outline */}
        <figure className="portrait mr-3.5 md:col-span-5 md:col-start-8 md:mt-24 md:mr-0">
          <div className="unveil">
            <ImageFrame
              src="/about/portrait-painted.jpg"
              alt="Painted portrait of Frank Kim leaning against a stone archway with arms crossed"
              ratio="2 / 3"
              priority
              sizes="(min-width: 768px) 38vw, 90vw"
            />
          </div>
        </figure>
      </div>
    </div>
  );
}
