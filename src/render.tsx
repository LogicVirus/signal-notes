import { renderToString } from "react-dom/server";
import type { ReactElement } from "react";
import { PageShell } from "./ui/components";
import { escapeHtml } from "./utils/html";

export type PageMeta = {
  title: string;
  description: string;
  path: string;
  siteUrl: string;
};

export function renderDocument(page: ReactElement, meta: PageMeta): string {
  const canonical = new URL(meta.path, meta.siteUrl).toString();
  const title = meta.title === "Signal Notes" ? meta.title : `${meta.title} | Signal Notes`;
  const app = renderToString(<PageShell>{page}</PageShell>);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <link rel="alternate" type="application/rss+xml" title="Signal Notes RSS" href="${escapeHtml(meta.siteUrl)}/feed.xml" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:image" content="${escapeHtml(meta.siteUrl)}/signal-notes-og.png" />
    <meta name="theme-color" content="#151515" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/styles.css" />
    <script type="module" src="/app.js"></script>
  </head>
  <body>
    <div id="root">${app}</div>
  </body>
</html>`;
}
