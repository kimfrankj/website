import Image from "next/image";

/** The painted picture that sits to the right of a page's title (About, Projects). */
export function SidePicture({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={`pointer-events-none col-span-6 col-start-7 row-start-1 -ml-4 self-start md:col-span-5 md:col-start-8 md:ml-0 ${className}`}
    >
      <div className="portrait-cutout overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={1000}
          height={1498}
          priority
          sizes="(min-width: 768px) 42vw, 55vw"
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
