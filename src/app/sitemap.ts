import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/contact"].map((p) => ({ url: `${site.url}${p}` }));
  // Projects and Writing are password-protected, so they stay out of the sitemap.
  return pages;
}
