import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ title: "JMF Docket", kicker: "Project · Frank Kim" });
}
