import Link from "next/link";
import { Words } from "@/components/Words";
import { Travertine } from "@/components/Travertine";
import { Scramble } from "@/components/Scramble";
import { Marquee } from "@/components/Marquee";

const index = [
  { href: "/about", label: "About", note: "" },
  { href: "/projects", label: "Projects", note: "Private" },
  { href: "/writing", label: "Writing", note: "Private" },
];

export default function Home() {
  return (
    <section className="relative">
      {/* Generative stone veins behind the whole page, full bleed */}
      <Travertine className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2" />
      <div className="wrap relative pt-[5vh] pb-[3vh] md:pt-[7vh]">
        {/* The page's <h1> is the name in the header (see Brand).
            The headline is set like a magazine opener: two lines, the second stepped in, with an italic turn. */}
        <div className="grid grid-cols-12 items-end gap-y-6">
          <p className="words display col-span-12 text-mega md:col-span-10">
            <span className="block"><Words text="Welcome to" /></span>
            <span className="block pl-[12%] md:pl-[22%]">
              <Words text="my" delay={160} />{" "}
              <em className="text-accent"><Words text="sandbox" delay={240} /></em>
              <span className="full-stop">.</span>
            </span>
          </p>
          {/* Home is page (00); the other pages run (01) to (04) in nav order. Hidden on phones to save the room */}
          <p className="rise-in label hidden md:col-span-2 md:block md:pb-6 md:text-right" style={{ "--i": 3 } as React.CSSProperties}>
            Home<br />
            <span className="text-ink">(00)</span>
          </p>
        </div>

        <div className="rise-in mt-[5vh]" style={{ "--i": 4 } as React.CSSProperties}>
          <Marquee words={["Deep Tech", "Energy", "AI", "Law"]} />
        </div>

        {/* Set like a book's contents page: each entry starts at its own indent, a leader line runs
            out to its note, and hovering one sets it in italic while the others fall back */}
        <ul className="index mt-[3vh]">
          {index.map((item, i) => (
            <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
              <Link href={item.href} className="index-link group">
                <span aria-hidden="true" className="index-ghost">{String(i + 1).padStart(2, "0")}</span>
                <span className="label font-sans">
                  <Scramble text={String(i + 1).padStart(2, "0")} />
                </span>
                <span className="index-word display text-giant">{item.label}</span>
                <span aria-hidden="true" className="index-leader" />
                <span className="label shrink-0 text-right">
                  {item.note ? <Scramble text={item.note} /> : <span className="nudge inline-block">→</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
