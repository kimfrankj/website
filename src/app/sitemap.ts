import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/projects", "/writing", "/contact"].map((p) => ({ url: `${site.url}${p}` }));
  const projects = getProjects().map((p) => ({ url: `${site.url}/projects/${p.slug}` }));
  const posts = getPosts().map((p) => ({ url: `${site.url}/writing/${p.slug}`, lastModified: p.updated ?? p.date }));
  return [...pages, ...projects, ...posts];
}
