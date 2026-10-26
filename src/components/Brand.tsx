"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { Magnetic } from "@/components/Magnetic";
import { Roll } from "@/components/Roll";

/** The name in the header. On the home page it is the page's <h1>, so search engines read the name as its heading. */
export function Brand() {
  const Tag = usePathname() === "/" ? "h1" : "div";
  return (
    <Tag className="font-display text-2xl leading-none tracking-tight">
      <Magnetic strength={0.2}>
        <Link href="/" className="group inline-block py-1">
          <Roll text={site.name} />
        </Link>
      </Magnetic>
    </Tag>
  );
}
