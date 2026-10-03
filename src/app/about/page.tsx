import type { Metadata } from "next";
import Image from "next/image";

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
          <div className="flex flex-1 flex-col justify-center py-10">
            <h1 className="display whitespace-nowrap text-[length:clamp(1.5rem,5.8vw,4.5rem)]">Building something new.</h1>

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

        {/* The portrait reaches up close to the nav bar. Its top edge is transparent, and it ignores clicks so the nav links stay usable */}
        <div className="pointer-events-none col-span-6 col-start-7 row-start-1 -ml-4 -mt-[28%] self-start md:col-span-5 md:col-start-8 md:ml-0">
          {/* The wrapper crops 25px off the bottom (negative margin + overflow hidden); the fade lives on the wrapper so it ends at the new bottom */}
          <div className="portrait-cutout overflow-hidden">
            <Image
              src="/about/portrait-wall.png"
              alt="Painted portrait of Frank Kim, arms crossed, in a white shirt, leaning against a stone archway"
              width={940}
              height={1500}
              priority
              sizes="(min-width: 768px) 42vw, 55vw"
              className="block h-auto w-full -mb-[25px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
