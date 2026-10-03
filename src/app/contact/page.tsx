import type { Metadata } from "next";
import { site, isPlaceholder } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Frank Kim.",
};

export default function Contact() {
  const all: [string, string, string][] = [
    ["Email", site.email, `mailto:${site.email}`],
    ["LinkedIn", site.links.linkedin, site.links.linkedin],
    ["X", site.links.x, site.links.x],
    ["GitHub", site.links.github, site.links.github],
  ];

  const rows = all.filter(([, text]) => !isPlaceholder(text));

  return (
    <div className="wrap pt-16 md:pt-28">
      <h1 className="display text-title">Contact</h1>
      <p className="mt-6 max-w-md text-muted">
        Founders, investors, collaborators, curious people: I’d like to hear from you.
      </p>
      <ul className="mt-16 md:mt-24">
        {rows.map(([label, text, href]) => (
          <li key={label} className="border-t border-line last:border-b">
            <a href={href} rel="noopener" className="group flex items-baseline justify-between gap-6 py-5">
              <span className="label">{label}</span>
              <span className="font-display text-2xl transition-colors group-hover:text-accent md:text-3xl">
                {text.replace(/^https?:\/\/(www\.)?/, "")} <span aria-hidden="true">↗</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
