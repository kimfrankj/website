import Image from "next/image";

/**
 * Renders a real image when `src` is given, otherwise a hatched placeholder
 * that says exactly what to replace. Never a stock photo.
 */
export function ImageFrame({
  src,
  alt = "",
  label,
  ratio = "16 / 10",
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  className = "",
}: {
  src?: string;
  alt?: string;
  label: string;
  ratio?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${src ? "bg-surface" : "placeholder"} ${className}`} style={{ aspectRatio: ratio }}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-end p-4">
          <p className="label bg-bg px-2 py-1">[IMAGE] {label}</p>
        </div>
      )}
    </div>
  );
}
