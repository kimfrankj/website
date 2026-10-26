/**
 * Everything personal lives here. Anything wrapped in [BRACKETS] is a
 * placeholder — search the repo for "[" to find what still needs filling in.
 */
export const site = {
  name: "Frank Kim",
  description:
    "Frank Kim: Yale Law School, Stanford GSB, Knight-Hennessy Scholar, and former Navy nuclear submarine officer working across law, capital, and deep tech.",
  // The canonical production domain. Every absolute URL (metadata, sitemap, schema) is built from this.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.frankjkim.com").replace(/\/$/, ""),
  email: "kimfrancisj@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/francis-j-kim/",
    x: "[X-URL]",
  },
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/contact", label: "Contact" },
] as const;

/** True while a value is still an unfilled [PLACEHOLDER]. */
export const isPlaceholder = (v: string) => v.includes("[");
