import Link from "next/link";
import { site } from "@/lib/site";
import { getPosts, getProjects } from "@/lib/content";
import { ProjectRow } from "@/components/ProjectRow";
import { PostRow } from "@/components/PostRow";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  const projects = getProjects();
  const posts = getPosts().slice(0, 3);

  const index = [
    { href: "/about", label: "About", note: "" },
    { href: "/projects", label: "Projects", note: projects.length ? "" : "Coming soon" },
    { href: "/writing", label: "Writing", note: posts.length ? "" : "Coming soon" },
  ];

  return (
    <>
      <section className="wrap pt-16 pb-24 md:pt-28 md:pb-36">
        <p className="label mb-10">Yale Law School</p>
        <h1 className="display text-hero max-w-4xl">
          Studying law.
          <br />
          <span className="text-muted">Building…</span>
        </h1>
        <p className="mt-12 max-w-md text-lg text-muted md:mt-16">{site.intro}</p>

        <ul className="mt-20 md:mt-28">
          {index.map((item, i) => (
            <li key={item.href} className="border-t border-line last:border-b">
              <Link href={item.href} className="group grid grid-cols-12 items-baseline gap-4 py-5">
                <span className="label col-span-2 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="display col-span-6 text-2xl transition-colors group-hover:text-accent md:col-span-7 md:text-3xl">
                  {item.label}
                </span>
                <span className="label col-span-4 text-right md:col-span-4">{item.note || "→"}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {projects.length > 0 && (
        <section className="wrap" aria-labelledby="projects-h">
          <h2 id="projects-h" className="label mb-6">Selected projects</h2>
          {projects.filter((p) => p.featured).slice(0, 3).map((p, i) => <ProjectRow key={p.slug} project={p} index={i} level={3} />)}
        </section>
      )}

      {posts.length > 0 && (
        <section className="wrap mt-24" aria-labelledby="writing-h">
          <Reveal>
            <h2 id="writing-h" className="label mb-6">Writing</h2>
            <ul>{posts.map((p) => <PostRow key={p.slug} post={p} level={3} />)}</ul>
          </Reveal>
        </section>
      )}
    </>
  );
}
