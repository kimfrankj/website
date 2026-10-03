import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import { postSchema, projectSchema, type PostMeta, type ProjectMeta } from "./schema";

const root = path.join(process.cwd(), "content");

export type Entry<T> = T & { slug: string; body: string };
export type Post = Entry<PostMeta> & { readingMinutes: number };

function load<S extends z.ZodType>(dir: string, schema: S): Entry<z.infer<S>>[] {
  const folder = path.join(root, dir);
  if (!fs.existsSync(folder)) return [];
  return fs
    .readdirSync(folder)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(folder, file), "utf8"));
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        // Fail the build loudly, with the file name, so a typo never ships.
        throw new Error(
          `Invalid frontmatter in content/${dir}/${file}:\n` +
            parsed.error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n"),
        );
      }
      return { ...(parsed.data as object), slug: file.replace(/\.mdx$/, ""), body: content } as Entry<z.infer<S>>;
    });
}

const showDrafts = process.env.NODE_ENV === "development";

export function getProjects(): Entry<ProjectMeta>[] {
  return load("projects", projectSchema)
    .filter((p) => showDrafts || !p.draft)
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

export const getProject = (slug: string) => getProjects().find((p) => p.slug === slug);

export function getPosts(): Post[] {
  return load("writing", postSchema)
    .filter((p) => showDrafts || !p.draft)
    .map((p) => ({ ...p, readingMinutes: Math.max(1, Math.round(p.body.split(/\s+/).length / 230)) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);

export const formatDate = (d: Date) =>
  d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
