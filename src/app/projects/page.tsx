import type { Metadata } from "next";
import Image from "next/image";
import { getProjects } from "@/lib/content";
import { ProjectRow } from "@/components/ProjectRow";

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
        <div className="relative z-10 col-span-7 col-start-1 row-start-1 flex flex-col md:col-span-6">
          <h1 className="display text-title">Projects</h1>

          <div className="flex flex-1 flex-col justify-center py-10">
            {projects.length === 0 ? (
              <p className="display text-[length:clamp(1.5rem,5.8vw,4.5rem)]">Coming soon.</p>
            ) : (
              projects.map((p, i) => <ProjectRow key={p.slug} project={p} index={i} />)
            )}
          </div>
        </div>

        <div className="pointer-events-none col-span-6 col-start-7 row-start-1 -ml-4 -mt-[20%] self-start md:col-span-5 md:col-start-8 md:ml-0">
          <div className="portrait-cutout overflow-hidden">
            <Image
              src="/projects/skyline.webp"
              alt="Painted view of the New York City skyline with the Empire State Building in soft evening light"
              width={1000}
              height={1498}
              priority
              sizes="(min-width: 768px) 42vw, 55vw"
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
