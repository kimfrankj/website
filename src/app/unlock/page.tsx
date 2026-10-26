import type { Metadata } from "next";
import { safeNext } from "@/lib/auth";
import { SidePicture } from "@/components/SidePicture";
import { PageTitle } from "@/components/PageTitle";
import { Current } from "@/components/Current";

export const metadata: Metadata = {
  title: "Private",
  robots: { index: false, follow: false },
};

export default async function Unlock({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  // Title the page after where the visitor was headed
  const target = safeNext(next);
  const title = target.startsWith("/writing") || target.startsWith("/feed") ? "Writing" : target.startsWith("/projects") ? "Projects" : "Private";

  return (
    <div className="wrap pt-[5vh] md:pt-[7vh]">
      <div className="grid grid-cols-12">
        <div className="legible relative z-10 col-[1/span_7] row-start-1 md:col-[1/span_6]">
          {/* The current threads from the title down to the password */}
          <Current />
          <PageTitle text={title} href={title === "Private" ? undefined : `/${title.toLowerCase()}`} className="mb-[6vh]" />
          <form action="/api/unlock" method="post" data-node>
            <input type="hidden" name="next" value={target} />
            <label htmlFor="password" className="label block">Password</label>
            {/* No box: the password is typed onto a line of veins, which turns rust while it's active */}
            <div className="mt-3 flex items-end gap-5">
              <span className="vein-field">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoFocus
                  autoComplete="current-password"
                  aria-describedby={error ? "pw-error" : undefined}
                  aria-invalid={error ? true : undefined}
                  className="w-40 rounded-none bg-transparent pb-1 text-lg outline-none sm:w-56"
                />
              </span>
              <button type="submit" className="label link-quiet whitespace-nowrap py-1.5 !text-ink">Enter</button>
            </div>
            {error && <p id="pw-error" role="alert" className="mt-3 text-accent">That password didn’t work.</p>}
          </form>
        </div>

        {title === "Projects" && (
          <SidePicture
            src="/projects/skyline.webp"
            size={[1000, 1498]}
            alt="Painted view of the New York City skyline with the Empire State Building in soft evening light"
            position="50% 65%"
          />
        )}
        {title === "Writing" && (
          <SidePicture
            src="/writing/painted-ladies.webp"
            size={[900, 1064]}
            alt="Painted view of San Francisco's Painted Ladies Victorian houses, with the city skyline behind a cypress tree"
            position="50% 50%"
          />
        )}
      </div>
    </div>
  );
}
