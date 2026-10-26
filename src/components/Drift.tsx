"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/** Lets its child drift up more slowly than the page as you scroll (parallax). */
export function Drift({ children, className }: { children: React.ReactNode; className?: string }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -120]);
  return (
    <div className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
