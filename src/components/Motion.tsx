"use client";
import { MotionConfig } from "framer-motion";

/** Makes every animation honour the visitor's prefers-reduced-motion setting. */
export function Motion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
