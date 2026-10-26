"use client";

import { useEffect, useRef } from "react";

/**
 * Living travertine: particles drift along a slowly turning flow field and leave faint
 * veins, like the stone the palette is named after. The cursor parts the veins.
 * Draws once and stops for visitors who prefer reduced motion; pauses when off-screen.
 */
export function Travertine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const BG = "244, 239, 230"; // --bg
    const INK = "34, 30, 25"; // --ink
    const RUST = "156, 68, 38"; // --accent

    let w = 0, h = 0, dpr = 1, frame = 0, t = 0, visible = true;
    const pointer = { x: -9999, y: -9999 };

    type P = { x: number; y: number; px: number; py: number; life: number; rust: boolean };
    let ps: P[] = [];
    const spawn = (p?: P): P => {
      const x = Math.random() * w, y = Math.random() * h;
      const n = p ?? ({} as P);
      n.x = n.px = x; n.y = n.py = y;
      n.life = 120 + Math.random() * 260;
      n.rust = Math.random() < 0.06;
      return n;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = `rgb(${BG})`;
      ctx.fillRect(0, 0, w, h);
      ps = Array.from({ length: Math.round(Math.min(1400, (w * h) / 1300)) }, () => spawn());
    };

    // A cheap, smooth pseudo-noise angle field that drifts with time
    const angle = (x: number, y: number) => {
      const f = 0.0028;
      return (
        Math.sin(x * f + t * 0.6) * 1.6 +
        Math.cos(y * f * 1.3 - t * 0.4) * 1.4 +
        Math.sin((x + y) * f * 0.55 + t * 0.25) * 2.2
      );
    };

    let tick = 0;
    const step = () => {
      t += 0.0035;
      tick++;
      // Fade old strokes back toward the paper so veins stay soft. A canvas stores whole colour steps,
      // so a tiny fade every frame rounds to nothing on faint strokes and they pile up forever. Fading
      // in bigger steps every 20 frames actually clears them (slowly, so veins linger), and a stronger
      // pass every 10 seconds lifts the last faint haze, so the density levels off instead of crowding.
      if (tick % 20 === 0) {
        ctx.fillStyle = `rgba(${BG}, ${tick % 600 === 0 ? 0.25 : 0.05})`;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.lineWidth = 0.7;
      for (const p of ps) {
        const a = angle(p.x, p.y);
        let vx = Math.cos(a) * 0.9, vy = Math.sin(a) * 0.9;
        const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) {
          const push = (1 - Math.sqrt(d2) / 140) * 3.2;
          const d = Math.sqrt(d2) || 1;
          vx += (dx / d) * push; vy += (dy / d) * push;
        }
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy;
        if (--p.life < 0 || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) { spawn(p); continue; }
        ctx.strokeStyle = p.rust ? `rgba(${RUST}, 0.22)` : `rgba(${INK}, 0.06)`;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    };

    const loop = () => {
      if (visible) step();
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
    };
    const onLeave = () => { pointer.x = pointer.y = -9999; };

    resize();
    if (still) {
      for (let i = 0; i < 260; i++) step();
      return;
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`travertine ${className}`} />;
}
