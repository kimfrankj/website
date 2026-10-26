"use client";

import { useEffect, useRef } from "react";

type Pt = { x: number; y: number };

// The strands of the current: a main ink line, two faint companions and a thread of rust,
// each set a little apart and swaying on its own rhythm, like the veins on the home page
const STRANDS = [
  { offset: 0, sway: 1, className: "current-strand" },
  { offset: -7, sway: 1.8, className: "current-strand current-strand-faint" },
  { offset: 6, sway: 2.4, className: "current-strand current-strand-faint" },
  { offset: 3, sway: 3.2, className: "current-strand current-strand-rust" },
];

// The drawing box reaches this far left of the column, so the current can swing out into the
// margin and still sit inside the box (its fade-out mask only covers the box)
const PAD = 120;

/** A smooth curve through the points (Catmull-Rom, drawn as cubic Béziers). */
function curve(pts: Pt[]) {
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Where an element sits inside `root`, ignoring transforms (so entrance animations don't move the current). */
function layoutPos(el: HTMLElement, root: HTMLElement) {
  let x = 0, y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft; y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/**
 * The current: the home page's flowing veins carried into the layout. A bundle of fine strands
 * flows down from the page title and threads through every element marked `data-node` in the
 * same parent, meandering between them, with a rust node where each entry meets it. It draws
 * itself in, then sways slowly. Place it as the first child of a positioned column.
 */
export function Current() {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current;
    const root = el?.parentElement;
    if (!el || !root) return;
    const paths = [...el.querySelectorAll<SVGPathElement>("path")];
    const dots = [...el.querySelectorAll<SVGCircleElement>("circle")];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let nodes: Pt[] = [];
    let route: (Pt & { bend: number })[] = [];
    let frame = 0;

    const measure = () => {
      const narrow = root.clientWidth < 500;
      const lead = narrow ? 12 : 22; // how far left of each entry the current runs
      nodes = [...root.querySelectorAll<HTMLElement>("[data-node]")].map((n) => {
        const p = layoutPos(n, root);
        return { x: p.x - lead, y: p.y + Math.min(n.offsetHeight * 0.5, 28) };
      });
      if (!nodes.length) return;
      // Between entries, the current wanders out and back so it meanders rather than zigzags
      route = [];
      nodes.forEach((p, i) => {
        route.push({ ...p, bend: 0 });
        const next = nodes[i + 1];
        if (next) {
          const swing = (i % 2 ? 1 : -1) * (narrow ? 10 : 34);
          route.push({ x: (p.x + next.x) / 2 + swing, y: (p.y + next.y) / 2, bend: 1 });
        }
      });
      // Then it carries on past the last entry, down and out toward the painting
      const last = nodes[nodes.length - 1];
      route.push({ x: last.x + (narrow ? 40 : 120), y: last.y + 110, bend: 1 });
      route.push({ x: last.x + (narrow ? 140 : 360), y: last.y + 190, bend: 1 });
      // Keep it on screen where the margin is thin (phones)
      const minX = 10 - root.getBoundingClientRect().left;
      for (const p of route) p.x = Math.max(p.x, minX);

      // Nodes appear as the line reaches them
      const lengths = route.map((p, i) => (i ? Math.hypot(p.x - route[i - 1].x, p.y - route[i - 1].y) : 0));
      const total = lengths.reduce((a, b) => a + b, 0) || 1;
      let run = 0, k = 0;
      route.forEach((p, i) => {
        run += lengths[i];
        if (p.bend === 0 && dots[k]) {
          dots[k].setAttribute("cx", p.x.toFixed(1));
          dots[k].setAttribute("cy", p.y.toFixed(1));
          dots[k].style.setProperty("--at", (run / total).toFixed(3));
          dots[k].style.display = "";
          k++;
        }
      });
      for (; k < dots.length; k++) dots[k].style.display = "none";
      draw(0);
    };

    // Each strand follows the route at its own offset; only the bends sway, so the
    // main line always passes through the nodes
    const draw = (t: number) => {
      if (!route.length) return;
      STRANDS.forEach((s, si) => {
        const pts = route.map((p, i) => {
          const w = p.bend ? s.sway : s.sway * 0.25;
          return {
            x: p.x + (si ? s.offset : 0) + Math.sin(t * 0.7 + i * 1.3 + si) * 3 * w * (si || p.bend ? 1 : 0),
            y: p.y + Math.cos(t * 0.5 + i * 0.9 + si * 2) * 2 * w * (si || p.bend ? 1 : 0),
          };
        });
        paths[si]?.setAttribute("d", curve(pts));
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    document.fonts?.ready.then(measure);
    if (!still) {
      const start = performance.now();
      const loop = (now: number) => {
        draw((now - start) / 1000);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    }
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg ref={svg} aria-hidden="true" className="current pointer-events-none absolute top-0 -z-10 h-[calc(100%+240px)] overflow-visible"
      style={{ left: -PAD, width: `calc(100% + ${PAD}px)` }}>
      <g transform={`translate(${PAD} 0)`}>
        {STRANDS.map((s, i) => (
          <path key={i} className={s.className} pathLength={1} style={{ "--s": i } as React.CSSProperties} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} r={3} className="current-node" style={{ display: "none" }} />
        ))}
      </g>
    </svg>
  );
}
