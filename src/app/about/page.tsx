import type { Metadata } from "next";
import { SidePicture } from "@/components/SidePicture";

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
        <div className="relative z-10 col-span-7 col-start-1 row-start-1 flex flex-col md:col-span-6">
          <h1 className="display text-title">About</h1>

          <div className="flex flex-1 flex-col justify-center py-10">
            <p className="display whitespace-nowrap text-[length:clamp(1.25rem,3.6vw,2.75rem)]">Building…</p>

            <dl className="mt-8 text-sm sm:text-base md:mt-16 md:max-w-md">
              {[
                ["Currently", "New Haven & New York."],
                ["Previously", "Palo Alto."],
              ].map(([label, value]) => (
                <div key={label} className="ruled ruled-last gap-1 py-5 sm:grid sm:grid-cols-3 sm:gap-4 md:py-6">
                  <dt className="label sm:pt-1">{label}</dt>
                  <dd className="sm:col-span-2">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <SidePicture
          src="/about/portrait-wall.png"
          alt="Painted portrait of Frank Kim, arms crossed, in a white shirt, leaning against a stone archway"
          position="50% 34%"
        />
      </div>
    </div>
  );
}
