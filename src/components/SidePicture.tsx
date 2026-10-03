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
}: {
  src: string;
  alt: string;
  position?: string;
}) {
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
          style={{ objectPosition: position }}
        />
      </div>
    </div>
  );
}
