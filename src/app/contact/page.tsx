import type { Metadata } from "next";
import { site, isPlaceholder } from "@/lib/site";
import { PageTitle } from "@/components/PageTitle";
import { Current } from "@/components/Current";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Frank Kim.",
};

export default function Contact() {
  // [what the link says, where it goes]: each link is simply named, not spelled out as an address
  const all: [string, string][] = [
    ["Email", `mailto:${site.email}`],
    ["LinkedIn", site.links.linkedin],
    ["X", site.links.x],
  ];

  const rows = all.filter(([, href]) => !isPlaceholder(href));

  return (
    <div className="wrap relative isolate pt-[5vh] md:pt-[7vh]">
      <Current />
      <PageTitle text="Contact" href="/contact" />
      <ul className="index mt-[6vh]">
        {rows.map(([text, href], i) => (
          <li key={href} style={{ "--i": i } as React.CSSProperties}>
            <a data-node href={href} rel="noopener" className="index-link group">
              <span className="index-word display text-[length:clamp(1.5rem,min(3.4vw,5vh),3rem)]">{text}</span>
              <span aria-hidden="true" className="index-leader" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
