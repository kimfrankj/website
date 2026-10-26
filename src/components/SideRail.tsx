"use client";

import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { nav, site } from "@/lib/site";

/**
 * A running head set vertically in the left margin on wide screens, like the spine of a book:
 * the name, the section you're in, and a hairline that fills as you scroll down the page.
 */
export function SideRail() {
  const path = usePathname();
  const section = nav.find((n) => path === n.href || path.startsWith(`${n.href}/`))?.label ?? "Home";
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <div aria-hidden="true" className="side-rail">
      <span className="label">{site.name}</span>
      <span className="side-rail-line">
        <motion.span style={{ scaleY: progress }} />
      </span>
      <span key={section} className="label side-rail-section">{section}</span>
    </div>
  );
}
