import { getSettings, getDevtoArticles } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.naheel.me";

export const revalidate = 3600;

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// ponytail: RSS 2.0 string builder — swap in a feed lib only if RSS fades and Atom/JSON-feed are wanted
export async function GET(): Promise<Response> {
  const s = await getSettings();
  const articles = s.devtoUsername ? await getDevtoArticles(s.devtoUsername) : [];

  const name = s.name || "Naheel Muhammed PK";
  const items = articles
    .filter((a) => a.slug)
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${BASE_URL}/blog/${a.slug}</link>
      <guid>${BASE_URL}/blog/${a.slug}</guid>
      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>
      <description>${esc(a.description)}</description>
      <source url="${BASE_URL}/rss.xml">${esc(name)} Blog</source>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(name)} - Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>${esc(s.metaDescription || `Articles by ${s.name}`)}</description>
    <language>en</language>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
