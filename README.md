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

Reading time is calculated automatically. The RSS feed (`/feed.xml`, password-protected), sitemap and social-share image update on their own. Frontmatter is validated at build time (`src/lib/schema.ts`), so a typo fails the build with the file name and field instead of shipping broken.

## Password protection

Projects, Writing and the RSS feed (`/feed.xml`) require a password. Everything else is public. The password is **not** in the code. It is read from an environment variable named `SITE_PASSWORD`.

- **Set or change it:** Vercel project → **Settings → Environment Variables** → add `SITE_PASSWORD` (Production), then redeploy. Changing it signs everyone out.
- **If it isn't set, those pages stay locked for everyone**, including you.
- **Run locally with a password:** create a file named `.env.local` containing `SITE_PASSWORD=choose-something` (it is git-ignored).
- Visitors who enter it stay signed in for 30 days on that browser. Protected pages are left out of the sitemap and `robots.txt` asks search engines to skip them.
- This is a single shared password, fine for keeping a personal area private. It is not a per-user login system.

The rules live in `src/proxy.ts` (which paths) and `src/lib/auth.ts` (the check).

## JMF Docket (daily data)

`/projects/jmf-docket` lists the active cases on Judge Jesse M. Furman's S.D.N.Y. docket, from CourtListener.

- **How it updates:** a GitHub Action (`.github/workflows/jmf-docket.yml`) runs `scripts/fetch-jmf-docket.mjs` once a day. It saves the list to `data/jmf-docket.json` and commits it, which triggers a normal Vercel deploy. The website itself never calls CourtListener.
- **Why:** CourtListener's free API allows only 5 requests a minute, 50 an hour and 125 a day. A full refresh is about 20 requests, so the script paces itself (one request every ~13 seconds) and uses about 20 of the 125 daily requests.
- **Setup:** add your CourtListener API token as a GitHub repository secret named `COURTLISTENER_TOKEN` (GitHub → the repo → Settings → Secrets and variables → Actions → New repository secret). Run it any time from the repo's **Actions** tab → **Update JMF Docket** → **Run workflow**.
- **Run it locally:** `COURTLISTENER_TOKEN=yourtoken node scripts/fetch-jmf-docket.mjs`
- **Posture, docket entries, parties and attorneys:** a second GitHub Action (`.github/workflows/jmf-posture.yml`, three times a day) runs `scripts/fetch-jmf-posture.mjs` with a budget of 30 requests per run, spent in priority order: (1) cases never checked — newest docket entries, which give the estimated posture and latest activity; (2) cases without parties/attorneys, or last fetched over a month ago — 2 requests each (parties with their roles, attorneys with role and contact details); (3) older pages of entries for cases whose history is incomplete; (4) routine re-checks, longest-unchecked first. Files: `data/jmf-entries/<id>.json`, `data/jmf-parties/<id>.json`, and the summary `data/jmf-posture.json`. With the daily list that is ~110 of the 125 free daily requests; first-time coverage of all cases takes about two weeks, after which it is steady upkeep. Each case has its own page at `/projects/jmf-docket/<docket id>` with the docket header, parties and attorneys, and every entry collected so far. Stage labels come from keyword rules in `scripts/posture-rules.mjs` — an estimate, not legal analysis.
- **What "active" means:** CourtListener has no termination date for the case. That data comes from PACER via RECAP, so a closed case can linger briefly. If a refresh fails, the previous list stays.

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
