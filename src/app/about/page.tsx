import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "About Frank Kim.",
};

export default function About() {
  return (
    <div className="wrap pt-16 md:pt-28">
      <h1 className="display text-title">About</h1>

      {/* The words and the portrait share one row: portrait to the right of the words,
          at every screen size. The portrait's soft left edge tucks under the text. */}
      <div className="mt-12 grid grid-cols-12 items-center md:mt-16">
        <div className="relative z-10 col-span-7 col-start-1 row-start-1 md:col-span-6">
          <p className="display text-3xl sm:text-5xl md:text-[length:var(--text-hero)]">Frolicking through life.</p>

          <dl className="ruled ruled-last mt-8 gap-1 py-5 text-sm sm:grid sm:grid-cols-3 sm:gap-4 sm:text-base md:mt-16 md:max-w-md md:py-6">
            <dt className="label sm:pt-1">Currently</dt>
            <dd className="sm:col-span-2">
              New Haven &amp; New York.
              <br />
              Building something new.
            </dd>
          </dl>
        </div>

        <div className="col-span-6 col-start-7 row-start-1 -ml-4 md:col-span-5 md:col-start-8 md:ml-0">
          <Image
            src="/about/portrait-wall.png"
            alt="Painted portrait of Frank Kim, arms crossed, in a white shirt, leaning against a stone archway"
            width={940}
            height={1500}
            priority
            sizes="(min-width: 768px) 42vw, 55vw"
            className="portrait-cutout h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
