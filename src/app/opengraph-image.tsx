import { ogImage, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const size = ogSize;
export const contentType = "image/png";
export const alt = site.name;

export default function Image() {
  return ogImage({ title: site.name, kicker: "Projects and writing" });
}
