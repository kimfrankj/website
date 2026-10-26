"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";
import { Magnetic } from "@/components/Magnetic";
import { Roll } from "@/components/Roll";

/** The header links: magnetic, letters roll on hover, and the page you're on keeps its underline and accent dot. */
export function NavLinks() {
  const path = usePathname();
  return (
    <ul className="flex gap-4 sm:gap-8">
      {nav.map((n) => {
        const current = path === n.href || path.startsWith(`${n.href}/`);
        return (
          <li key={n.href}>
            <Magnetic>
              <Link
                href={n.href}
                aria-current={current ? "page" : undefined}
                className="nav-link group label link-quiet inline-block py-1.5 !text-ink"
              >
                <Roll text={n.label} />
              </Link>
            </Magnetic>
          </li>
        );
      })}
    </ul>
  );
}
