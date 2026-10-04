import Image from "next/image";

/**
 * The painted picture that sits to the right of a page's title (About, Projects, Writing).
 * Every picture gets the same frame — same width, same 3:4 height, same top position — and is
 * cropped to fit. `position` chooses which part of the photo stays in view (CSS object-position).
 */
export function SidePicture({
  src,
  alt,
  position = "50% 50%",
  fadeSides = 0,
}: {
  src: string;
  alt: string;
  position?: string;
  /** Soft fade on the left and right edges, as a percentage of the width. Needed when cropping to the frame cut off the picture's own soft edges. */
  fadeSides?: number;
}) {
  // Eased steps rather than a straight ramp, so the edge dissolves instead of looking like a stripe
  const f = fadeSides;
  const side = f
    ? `linear-gradient(to right, transparent 0%, rgba(0,0,0,0.12) ${f * 0.3}%, rgba(0,0,0,0.45) ${f * 0.6}%, #000 ${f}%, #000 ${100 - f}%, rgba(0,0,0,0.45) ${100 - f * 0.6}%, rgba(0,0,0,0.12) ${100 - f * 0.3}%, transparent 100%)`
    : undefined;
  return (
    <div className="pointer-events-none col-span-6 col-start-7 row-start-1 -ml-4 -mt-[22%] self-start md:col-span-5 md:col-start-8 md:ml-0">
      <div className="portrait-cutout relative aspect-[3/4] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 768px) 42vw, 55vw"
          className="object-cover"
          style={{ objectPosition: position, ...(side && { maskImage: side, WebkitMaskImage: side }) }}
        />
      </div>
    </div>
  );
}
