import type { MetadataRoute } from "next";
import { site, isPlaceholder } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    // Skipped until a real domain is set, so we never publish an invalid URL.
    ...(isPlaceholder(site.url) ? {} : { sitemap: `${site.url}/sitemap.xml` }),
  };
}
