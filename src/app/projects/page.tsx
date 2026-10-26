import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { ProjectRow } from "@/components/ProjectRow";
import { SidePicture } from "@/components/SidePicture";
import { Words } from "@/components/Words";
import { PageTitle } from "@/components/PageTitle";
import { Current } from "@/components/Current";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects by Frank Kim.",
};

export default function Projects() {
  const projects = getProjects();

  return (
    <div className="wrap pt-16 md:pt-28">
      {/* Same arrangement as About: title and content on the left, painted picture on the right */}
      <div className="grid grid-cols-12">
        <div className="legible relative z-10 col-[1/span_7] row-start-1 flex flex-col md:col-[1/span_6]">
          {/* The current threads down through the title and every entry */}
          <Current />
          <PageTitle text="Projects" href="/projects" />

          <div className="flex flex-1 flex-col justify-center py-10">
            {projects.length === 0 ? (
              <p className="words display text-[length:clamp(1.5rem,5.8vw,4.5rem)]"><Words text="Coming soon." delay={250} /></p>
            ) : (
              <div className="index">{projects.map((p, i) => <ProjectRow key={p.slug} project={p} index={i} />)}</div>
            )}
          </div>
        </div>

        <SidePicture
          src="/projects/skyline.webp"
          size={[1000, 1498]}
          alt="Painted view of the New York City skyline with the Empire State Building in soft evening light"
          position="50% 65%"
        />
      </div>
    </div>
  );
}
