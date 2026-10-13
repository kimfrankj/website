"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

/** The name in the header. On the home page it is the page's <h1>, so search engines read the name as its heading. */
export function Brand() {
  const Tag = usePathname() === "/" ? "h1" : "div";
  return (
    <Tag className="font-display text-2xl leading-none tracking-tight">
      <Link href="/" className="inline-block py-1">
        {site.name}
      </Link>
    </Tag>
  );
}
