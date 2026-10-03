import Link from "next/link";
import { site } from "@/lib/site";
import { getPosts, getProjects } from "@/lib/content";
import { ImageFrame } from "@/components/ImageFrame";
import { ProjectRow } from "@/components/ProjectRow";
import { PostRow } from "@/components/PostRow";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  const projects = getProjects().filter((p) => p.featured).slice(0, 3);
  const posts = getPosts().slice(0, 3);

  return (
    <>
      <section className="wrap pt-10 pb-24 md:pt-20 md:pb-40">
        <p className="label mb-8">Yale Law School · Emerging technology · Startups</p>

        {/* Memorable moment 1: type at architectural scale, with the image slot tucked beneath it */}
        <div className="relative md:min-h-[38vw]">
          <h1 className="display text-hero relative z-10">
            Studying <em className="text-accent">law.</em>
            <br />
            <span className="md:ml-[12vw]">Building what</span>
            <br />
            <span className="md:ml-[4vw]">comes next.</span>
          </h1>
          <div className="mt-10 md:absolute md:right-0 md:top-[4%] md:mt-0 md:w-[28%]">
            <ImageFrame
              label="Hero image, 4:5. Replace with your own, e.g. /public/about/hero.jpg"
              ratio="4 / 5"
              priority
              sizes="(min-width: 768px) 28vw, 100vw"
            />
          </div>
        </div>

        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
          <p className="max-w-xl text-lg md:col-span-5 md:col-start-2">{site.intro}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 md:col-span-4 md:col-start-8 md:flex-col md:gap-1">
            {[
              ["/about", "About"],
              ["/projects", "Projects"],
              ["/writing", "Writing"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="font-display text-3xl link">{label} <span aria-hidden="true">→</span></Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="wrap" aria-labelledby="projects-h">
          <div className="mb-10 flex items-baseline justify-between">
            <h2 id="projects-h" className="label">Selected projects</h2>
            <Link href="/projects" className="label link !text-ink">All projects</Link>
          </div>
          {projects.map((p, i) => <ProjectRow key={p.slug} project={p} index={i} level={3} />)}
        </section>
      )}

      {posts.length > 0 && (
        <section className="wrap mt-24" aria-labelledby="writing-h">
          <Reveal>
            <div className="mb-10 flex items-baseline justify-between">
              <h2 id="writing-h" className="label">Writing</h2>
              <Link href="/writing" className="label link !text-ink">All writing</Link>
            </div>
            <ul>{posts.map((p) => <PostRow key={p.slug} post={p} level={3} />)}</ul>
          </Reveal>
        </section>
      )}
    </>
  );
}
