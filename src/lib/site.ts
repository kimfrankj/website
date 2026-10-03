/**
 * Everything personal lives here. Anything wrapped in [BRACKETS] is a
 * placeholder — search the repo for "[" to find what still needs filling in.
 */
export const site = {
  name: "Frank Kim",
  // Draft positioning line. Edit freely.
  tagline: "Studying law. Building what comes next.",
  intro:
    "I’m a student at Yale Law School, fascinated by emerging technology and always looking for new ways to improve people’s lives. This is where I build startups and, eventually, share what I’m thinking.",
  description:
    "Frank Kim — Yale Law student, builder of startups, writing about emerging technology.",
  // Set NEXT_PUBLIC_SITE_URL in Vercel once the GoDaddy domain is connected.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://[YOUR-DOMAIN].com").replace(/\/$/, ""),
  email: "[YOUR-EMAIL]",
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
