import { topics } from "../content";
import type { PublicSignal } from "../content/types";
import { escapeHtml } from "../utils/html";

export function renderRss(signals: PublicSignal[], siteUrl: string): string {
  const latestDate = signals[0]?.publishedAt ?? new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Signal Notes</title>
    <link>${escapeHtml(siteUrl)}</link>
    <atom:link href="${escapeHtml(siteUrl)}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Curated notes on tools, AI workflows, sources, and web stack patterns.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(latestDate).toUTCString()}</lastBuildDate>
${signals.slice(0, 24).map((signal) => renderItem(signal, siteUrl)).join("\n")}
  </channel>
</rss>`;
}

function renderItem(signal: PublicSignal, siteUrl: string): string {
  const url = signal.origin === "manual" ? `${siteUrl}/signals/${signal.slug}` : signal.url ?? siteUrl;
  const categories = signal.topicSlugs
    .map((slug) => topics.find((topic) => topic.slug === slug)?.name)
    .filter(Boolean)
    .map((name) => `      <category>${escapeHtml(name ?? "")}</category>`)
    .join("\n");

  return `    <item>
      <title>${escapeHtml(signal.title)}</title>
      <link>${escapeHtml(url)}</link>
      <guid isPermaLink="false">${escapeHtml(signal.id)}</guid>
      <pubDate>${new Date(signal.publishedAt).toUTCString()}</pubDate>
      <description>${escapeHtml(signal.summary)}</description>
${categories}
    </item>`;
}
