# Frank Kim — personal site

Next.js (App Router) · TypeScript · Tailwind CSS v4 · MDX content · deployed on Vercel.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run lint`, `npm run typecheck`, `npm run build`, `npm start`.

## Fill in the placeholders

Everything marked `[LIKE THIS]` is a placeholder. Search the project for `[` to find them.

- **Name, email, social links:** `src/lib/site.ts`
- **Bio:** `src/app/about/page.tsx`
- **Photos:** images only appear when you provide one. Drop a file in `public/projects/` and set `image:` in a project's frontmatter.

## Add a project

Create one file: `content/projects/my-project.mdx` (the filename becomes the URL: `/projects/my-project`).

```mdx
---
title: "My Project"
summary: "One line on what it is and who it helps."
status: building        # idea | building | live | paused | exited
year: 2026
image: /projects/my-project.jpg   # optional; file goes in public/projects/
imageAlt: "Describe the image"
featured: true          # show on the homepage
links:
  - label: "Website"
    url: "https://example.com"
---

Write the page body here in Markdown.
```

Set `draft: true` to hide it from the live site (drafts still show in `npm run dev`). The included `placeholder-project.mdx` is a hidden template: copy it, rename it and delete the `draft: true` line.

## Publish an essay

Create one file: `content/writing/my-essay.mdx` (URL: `/writing/my-essay`).

```mdx
---
title: "My Essay"
summary: "One or two sentences on what it argues."
date: 2026-11-01
tags: ["technology", "law"]
---

Write in Markdown.
```

Reading time is calculated automatically. The RSS feed (`/feed.xml`), sitemap and social-share image update on their own. Frontmatter is validated at build time (`src/lib/schema.ts`), so a typo fails the build with the file name and field instead of shipping broken.

## Deploy

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), choose **Add New → Project**, import the repo and click Deploy. Every push to `main` then deploys automatically; other branches get preview URLs.
3. **Custom domain (GoDaddy):** in Vercel go to the project's **Settings → Domains**, add your domain, and Vercel shows the exact DNS records. In GoDaddy's DNS settings, add them (typically an `A` record for `@` and a `CNAME` for `www`). No code changes are needed.
4. Add an environment variable in Vercel: `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com` (no trailing slash), then redeploy. This sets canonical URLs, the sitemap, the RSS feed and social images.
5. Turn on **Analytics** for the project in Vercel (the tracking code is already installed).

## Structure

```
content/projects, content/writing   MDX content, one file each
src/app                              pages, sitemap, robots, RSS, OG images
src/components                       UI building blocks
src/lib/site.ts                      your details
src/lib/schema.ts                    content frontmatter rules
src/app/globals.css                  design tokens (palette, type, grain)
```

Colors live as CSS variables at the top of `globals.css` (light and dark). Fonts are Instrument Serif and Geist via `next/font`.
