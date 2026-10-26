import type { Metadata } from "next";
import { SidePicture } from "@/components/SidePicture";
import { Words } from "@/components/Words";
import { PageTitle } from "@/components/PageTitle";
import { Current } from "@/components/Current";

export const metadata: Metadata = {
  title: "About",
  description: "About Frank Kim.",
};

export default function About() {
  return (
    <div className="wrap pt-16 md:pt-28">
      {/* One row: the words on the left, the portrait on the right, reaching up close to the nav bar.
          The portrait's soft left edge tucks under the text at every screen size. */}
      <div className="grid grid-cols-12">
        <div className="legible relative z-10 col-[1/span_7] row-start-1 flex flex-col md:col-[1/span_6]">
          {/* The current threads down through the title and every entry */}
          <Current />
          <PageTitle text="About" href="/about" />

          <div className="flex flex-1 flex-col justify-center py-10">
            {/* Italic, with the ellipsis typing itself out over and over */}
            <p data-node className="words display whitespace-nowrap text-[length:clamp(1.5rem,4.4vw,3.5rem)]">
              <em><Words text="Building something" delay={250} /></em>
              <span className="typing"><span>.</span><span>.</span><span>.</span></span>
            </p>

            {/* Where I am and was: loose notes at staggered indents, each a small label,
                then the places in large italic with the city beneath, newest first */}
            <dl className="index mt-8 md:mt-14">
              {[
                { label: "Currently", places: [["Yale Law School", "New Haven & New York"]] },
                { label: "Previously", places: [["Stanford GSB", "Palo Alto"], ["Underwater", "Pacific Ocean"]] },
              ].map(({ label, places }, i) => (
                <div key={label} style={{ "--i": i, "--start": "0.6s" } as React.CSSProperties} className="py-3 md:py-4">
                  <dt className="label font-sans">{label}</dt>
                  {places.map(([place, city]) => (
                    <dd key={place} className="mt-1 [&+dd]:mt-4">
                      <span data-node className="display block text-[length:clamp(1.4rem,3vw,2.5rem)] italic leading-[1.05]">{place}</span>
                      <span className="mt-1 flex items-center gap-2 text-sm sm:text-base">
                        <span aria-hidden="true" className="index-leader !mt-0 w-6 !flex-none" />
                        {city}
                      </span>
                    </dd>
                  ))}
                </div>
              ))}
            </dl>
          </div>
        </div>

        <SidePicture
          src="/about/portrait-wall.png"
          size={[940, 1500]}
          alt="Painted portrait of Frank Kim, arms crossed, in a white shirt, leaning against a stone archway"
          position="50% 34%"
        />
      </div>
    </div>
  );
}
