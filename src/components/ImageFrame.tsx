import Image from "next/image";

/** Renders the image when `src` is set; renders nothing otherwise (no filler boxes). */
export function ImageFrame({
  src,
  alt = "",
  ratio = "16 / 9",
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  className = "",
}: {
  src?: string;
  alt?: string;
  ratio?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <div className={`relative overflow-hidden bg-surface ${className}`} style={{ aspectRatio: ratio }}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
