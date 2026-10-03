/**
 * Everything personal lives here. Anything wrapped in [BRACKETS] is a
 * placeholder — search the repo for "[" to find what still needs filling in.
 */
export const site = {
  name: "Frank Kim",
  description: "Frank Kim. Projects and writing.",
  // Set NEXT_PUBLIC_SITE_URL in Vercel once the GoDaddy domain is connected.
  // Until then Vercel's own production URL is used, then a placeholder.
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://[YOUR-DOMAIN].com")
  ).replace(/\/$/, ""),
  email: "kimfrancisj@gmail.com",
  links: {
    github: "https://github.com/kimfrankj",
    linkedin: "[LINKEDIN-URL]",
    x: "[X-URL]",
  },
} as const;

export const nav = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/contact", label: "Contact" },
] as const;

/** True while a value is still an unfilled [PLACEHOLDER]. */
export const isPlaceholder = (v: string) => v.includes("[");
