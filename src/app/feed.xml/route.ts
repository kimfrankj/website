import { getPosts } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const posts = getPosts();
  const items = posts
    .map(
      (p) => `<item>
<title>${esc(p.title)}</title>
<link>${site.url}/writing/${p.slug}</link>
<guid isPermaLink="true">${site.url}/writing/${p.slug}</guid>
<pubDate>${p.date.toUTCString()}</pubDate>
<description>${esc(p.summary)}</description>
${p.tags.map((t) => `<category>${esc(t)}</category>`).join("")}
</item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(site.name)}</title>
<link>${site.url}</link>
<description>${esc(site.description)}</description>
<language>en-us</language>
<atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
${posts[0] ? `<lastBuildDate>${posts[0].date.toUTCString()}</lastBuildDate>` : ""}
${items}
</channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
