import type { Metadata } from "next";
import { safeNext } from "@/lib/auth";
import { SidePicture } from "@/components/SidePicture";

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
    <div className="wrap pt-16 md:pt-28">
      <div className="grid grid-cols-12">
        <div className="relative z-10 col-span-7 col-start-1 row-start-1 md:col-span-6">
          <h1 className="display text-title mb-16 md:mb-24">{title}</h1>
          <form action="/api/unlock" method="post">
            <input type="hidden" name="next" value={target} />
            <label htmlFor="password" className="label block">Password</label>
            {/* Box and Enter sit side by side */}
            <div className="mt-2 flex items-center gap-4">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                aria-describedby={error ? "pw-error" : undefined}
                aria-invalid={error ? true : undefined}
                className="w-32 rounded-none border border-line bg-transparent px-3 py-1 text-base outline-none focus:border-ink sm:w-48"
              />
              <button type="submit" className="label link-quiet whitespace-nowrap py-1.5 !text-ink">Enter →</button>
            </div>
            {error && <p id="pw-error" role="alert" className="mt-3 text-accent">That password didn’t work.</p>}
          </form>
        </div>

        {title === "Projects" && (
          <SidePicture
            src="/projects/skyline.webp"
            alt="Painted view of the New York City skyline with the Empire State Building in soft evening light"
            position="50% 65%"
          />
        )}
        {title === "Writing" && (
          <SidePicture
            src="/writing/painted-ladies.webp"
            alt="Painted view of San Francisco's Painted Ladies Victorian houses, with the city skyline behind a cypress tree"
            position="50% 50%"
          />
        )}
      </div>
    </div>
  );
}
