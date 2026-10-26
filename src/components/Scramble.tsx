"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·—";

/** Text that decodes itself, glyph by glyph, whenever its link is hovered or focused. */
export function Scramble({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.closest("a, button");
    if (!el || !host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      const start = performance.now();
      const tick = (now: number) => {
        const done = (now - start) / 32; // characters settled so far
        el.textContent = [...text]
          .map((c, i) => (c === " " || i < done ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join("");
        if (done < text.length) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    host.addEventListener("pointerenter", run);
    host.addEventListener("focus", run);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointerenter", run);
      host.removeEventListener("focus", run);
      el.textContent = text;
    };
  }, [text]);

  return <span ref={ref} className="tabular-nums">{text}</span>;
}
