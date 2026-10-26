import type { Metadata } from "next";
import { site, isPlaceholder } from "@/lib/site";
import { PageTitle } from "@/components/PageTitle";
import { Current } from "@/components/Current";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Frank Kim.",
};

export default function Contact() {
  const all: [string, string, string][] = [
    ["Email", site.email, `mailto:${site.email}`],
    ["LinkedIn", site.links.linkedin, site.links.linkedin],
    ["X", site.links.x, site.links.x],
  ];

  const rows = all.filter(([, text]) => !isPlaceholder(text));

  return (
    <div className="wrap relative isolate pt-16 md:pt-28">
      <Current />
      <PageTitle text="Contact" href="/contact" />
      <ul className="index mt-16 md:mt-24">
        {rows.map(([label, text, href], i) => (
          <li key={label} style={{ "--i": i } as React.CSSProperties}>
            <a data-node href={href} rel="noopener" className="index-link group">
              <span className="label w-16 shrink-0 font-sans md:w-20">{label}</span>
              <span className="index-word display min-w-0 break-all text-[length:clamp(1.5rem,4.6vw,4rem)]">
                {text.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
              <span aria-hidden="true" className="index-leader" />
              <span aria-hidden="true" className="nudge-up inline-block shrink-0 font-display text-2xl md:text-4xl">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
