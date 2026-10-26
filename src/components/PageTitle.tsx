import { nav } from "@/lib/site";
import { Words } from "@/components/Words";

/**
 * An oversized page title with its place in the site's index set small beside it, e.g. Projects ⁽⁰²⁾.
 * The number comes from the page's position in the nav.
 */
export function PageTitle({ text, href, className = "" }: { text: string; href?: string; className?: string }) {
  const n = nav.findIndex((item) => item.href === href);
  return (
    <h1 data-node className={`words display text-title whitespace-nowrap ${className}`}>
      <Words text={text} />
      {n >= 0 && (
        <sup className="rise-in label ml-2 align-top font-sans text-[0.7rem] !text-accent md:ml-3" style={{ "--i": 1 } as React.CSSProperties}>
          ({String(n + 1).padStart(2, "0")})
        </sup>
      )}
    </h1>
  );
}
