import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1).max(240), // one line for index pages and meta description
  status: z.enum(["idea", "building", "live", "paused", "exited"]),
  year: z.number().int().min(2000).max(2100),
  /** Path under /public, e.g. /projects/my-project.jpg. Omit to show a placeholder frame. */
  image: z.string().startsWith("/").optional(),
  imageAlt: z.string().optional(),
  links: z.array(z.object({ label: z.string(), url: z.string().min(1) })).default([]),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
});

export const postSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1).max(280),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  image: z.string().startsWith("/").optional(),
  imageAlt: z.string().optional(),
  draft: z.boolean().default(false),
});

export type ProjectMeta = z.infer<typeof projectSchema>;
export type PostMeta = z.infer<typeof postSchema>;
