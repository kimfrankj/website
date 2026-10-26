import { useId } from "react";
import { getImageProps } from "next/image";
import { Drift } from "@/components/Drift";

// The canvas is 4:5; drawn in SVG units so brush strokes can be laid across it
const W = 300, H = 375;

// Blots of colour that bloom into the canvas one after another, from the middle outward,
// like watercolour dropped onto wet paper: [x, y, radius] in canvas units
const BLOTS = [
  [150, 175, 72], [100, 115, 56], [205, 120, 60], [120, 252, 62], [200, 262, 58], [150, 70, 52],
  [68, 190, 48], [236, 196, 50], [150, 322, 50], [88, 320, 40], [222, 330, 42], [150, 245, 60],
];

/**
 * The painting on the About, Projects and Writing pages, painted straight onto the page rather than
 * framed: it reaches off the right edge of the screen, sits beside the page's words (just behind them on
 * phones, where the words get a paper halo; see `.legible`), and drifts as you scroll.
 * A pencil underdrawing appears first, then colour slowly blots in, bloom by bloom from the middle outward,
 * and a last coat fills the heart of it, leaving the underdrawing showing around the ragged edges like an
 * unfinished canvas.
 * `position` chooses which part of the picture stays in view (like CSS object-position).
 * Without motion it simply shows the finished painting.
 */
export function SidePicture({
  src,
  alt,
  size,
  position = "50% 50%",
}: {
  src: string;
  alt: string;
  /** The image file's own width and height in pixels, to crop it the way object-fit: cover would. */
  size: [number, number];
  position?: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { props: img } = getImageProps({ src, alt: "", fill: true, sizes: "(min-width: 768px) 55vw, 70vw" });

  // Cover-crop: scale to fill the canvas, then shift by `position`
  const [iw, ih] = size;
  const s = Math.max(W / iw, H / ih);
  const [px, py] = position.split(" ").map((v) => parseFloat(v) / 100);
  const box = { width: iw * s, height: ih * s, x: (W - iw * s) * px, y: (H - ih * s) * py };

  return (
    <Drift className="bleed-right pointer-events-none col-[6/span_7] row-start-1 md:col-[7/span_6] -mt-[18%] self-start">
      <div className="painted relative aspect-[4/5]">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={alt} className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            {/* Pencil: edges of the picture traced as dark lines on paper */}
            <filter id={`${id}-pencil`} colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" />
              <feGaussianBlur stdDeviation="0.4" />
              <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" />
              <feComponentTransfer>
                <feFuncR type="gamma" amplitude="-2.6" exponent="0.8" offset="1" />
                <feFuncG type="gamma" amplitude="-2.6" exponent="0.8" offset="1" />
                <feFuncB type="gamma" amplitude="-2.6" exponent="0.8" offset="1" />
              </feComponentTransfer>
            </filter>
            {/* Blot edges: torn by noise, then softened, like pigment bleeding into wet paper */}
            <filter id={`${id}-blot`} x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="4" result="warp" />
              <feDisplacementMap in="SourceGraphic" in2="warp" scale="30" xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
            {/* The last coat: a torn, softened blob that fills the heart of the painting */}
            <filter id={`${id}-coat`} x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="7" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="46" xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <mask id={`${id}-paint`} maskUnits="userSpaceOnUse" x="-40" y="-40" width={W + 80} height={H + 80}>
              <g filter={`url(#${id}-blot)`} fill="#fff">
                {BLOTS.map(([cx, cy, r], i) => (
                  <circle key={i} cx={cx} cy={cy} r={r} className="blot" style={{ "--i": i } as React.CSSProperties} />
                ))}
              </g>
              <ellipse cx={W / 2} cy={H * 0.48} rx={W * 0.36} ry={H * 0.38} fill="#fff" filter={`url(#${id}-coat)`} className="brush-fill" />
            </mask>
            {/* The underdrawing fades out toward the edges of the canvas */}
            <radialGradient id={`${id}-fade`}>
              <stop offset="0.45" stopColor="#fff" />
              <stop offset="1" stopColor="#000" />
            </radialGradient>
            <mask id={`${id}-sketch`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
              <rect width={W} height={H} fill={`url(#${id}-fade)`} />
            </mask>
          </defs>

          <g mask={`url(#${id}-sketch)`}>
            <image href={img.src} {...box} preserveAspectRatio="none" filter={`url(#${id}-pencil)`} className="sketch" />
          </g>
          <g mask={`url(#${id}-paint)`}>
            <image href={img.src} {...box} preserveAspectRatio="none" className="breathe" />
          </g>
        </svg>
      </div>
    </Drift>
  );
}
