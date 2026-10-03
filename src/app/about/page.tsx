import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Frank Kim is a Navy veteran from Houston, Texas, studying at Yale Law School.",
};

const facts: [string, string][] = [
  ["From", "Houston, Texas"],
  ["Service", "U.S. Navy veteran"],
  ["Education", "U.S. Naval Academy · Stanford MBA"],
  ["Now", "Yale Law School"],
];

export default function About() {
  return (
    <div className="wrap pt-16 md:pt-28">
      <h1 className="display text-title">About</h1>

      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12">
        <p className="font-display text-[length:var(--text-lead)] leading-snug md:col-span-6">{site.intro}</p>

        <dl className="md:col-span-4 md:col-start-9">
          {facts.map(([k, v]) => (
            <div key={k} className="grid grid-cols-3 gap-4 border-t border-line py-4 last:border-b">
              <dt className="label pt-1">{k}</dt>
              <dd className="col-span-2">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
