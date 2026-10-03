import Image from "next/image";

/** The painted picture that sits to the right of a page's title (About, Projects). */
export function SidePicture({
  src,
  alt,
  width = 1000,
  height = 1498,
  cropTop = 0,
  className = "",
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Pixels trimmed from the top of the picture (what remains stays where it was). */
  cropTop?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none col-span-6 col-start-7 row-start-1 -ml-4 self-start md:col-span-5 md:col-start-8 md:ml-0 ${className}`}
    >
      <div className="portrait-cutout overflow-hidden" style={cropTop ? { marginTop: cropTop } : undefined}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority
          sizes="(min-width: 768px) 42vw, 55vw"
          className="block h-auto w-full"
          style={cropTop ? { marginTop: -cropTop } : undefined}
        />
      </div>
    </div>
  );
}
