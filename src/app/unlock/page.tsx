import type { Metadata } from "next";
import { safeNext } from "@/lib/auth";

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
      <h1 className="display text-title mb-16 md:mb-24">{title}</h1>
      <form action="/api/unlock" method="post" className="max-w-[12rem]">
        <input type="hidden" name="next" value={target} />
        <label htmlFor="password" className="label block">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          aria-describedby={error ? "pw-error" : undefined}
          aria-invalid={error ? true : undefined}
          className="mt-2 w-full rounded-none border border-line bg-transparent px-3 py-1 text-base outline-none focus:border-ink"
        />
        {error && <p id="pw-error" role="alert" className="mt-3 text-accent">That password didn’t work.</p>}
        <button type="submit" className="label link-quiet mt-8 py-1.5 !text-ink">Enter →</button>
      </form>
    </div>
  );
}
