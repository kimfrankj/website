import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "About Frank Kim.",
};

export default function About() {
  return (
    <div className="wrap pt-16 md:pt-28">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        {/* Words on the left: heading at the top, the rest settling toward the portrait's base */}
        <div className="flex flex-col justify-between gap-16 md:col-span-6">
          <h1 className="display text-title">About</h1>

          <div className="md:pb-16">
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

        {/* Portrait to the right of the words, cut out so it sits directly on the page */}
        <div className="md:col-span-6 md:col-start-7 md:-mt-12">
          <Image
            src="/about/portrait-painted.png"
            alt="Painted portrait of Frank Kim, arms crossed, in a white shirt"
            width={780}
            height={1270}
            priority
            sizes="(min-width: 768px) 46vw, 100vw"
            className="portrait-cutout mx-auto h-auto w-full max-w-[34rem]"
          />
        </div>
      </div>
    </div>
  );
}
