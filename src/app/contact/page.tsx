import type { Metadata } from "next";
import { site, isPlaceholder } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Frank Kim.",
};

export default function Contact() {
  const rows: [string, string, string][] = [
    ["Email", site.email, `mailto:${site.email}`],
    ["LinkedIn", site.links.linkedin, site.links.linkedin],
    ["X", site.links.x, site.links.x],
    ["GitHub", site.links.github, site.links.github],
  ];

  return (
    <div className="wrap pt-10 md:pt-20">
      <h1 className="display text-title">Say hello</h1>
      <p className="mt-6 max-w-xl text-lg text-muted">
        Founders, investors, collaborators, curious people: I’d like to hear from you.
      </p>
      <ul className="mt-20">
        {rows.map(([label, text, href]) => (
          <li key={label} className="border-t border-line">
            {isPlaceholder(text) ? (
              <div className="flex items-baseline justify-between gap-6 py-6 text-muted">
                <span className="label">{label}</span>
                <span className="font-display text-3xl md:text-5xl">{text}</span>
              </div>
            ) : (
              <a href={href} rel="noopener" className="group flex items-baseline justify-between gap-6 py-6">
                <span className="label">{label}</span>
                <span className="font-display text-3xl transition-colors group-hover:text-accent md:text-5xl">
                  {text.replace(/^https?:\/\/(www\.)?/, "")} <span aria-hidden="true">↗</span>
                </span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
