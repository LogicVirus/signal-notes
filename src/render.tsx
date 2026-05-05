import { renderToString } from "react-dom/server";
import type { ReactElement } from "react";
import { PageShell } from "./ui/components";
import { buildSiteUrl, withBasePath } from "./paths";
import { escapeHtml } from "./utils/html";

export type PageMeta = {
  title: string;
  description: string;
  path: string;
  siteUrl: string;
  basePath?: string;
};

export function renderDocument(page: ReactElement, meta: PageMeta): string {
  const basePath = meta.basePath ?? "";
  const canonical = buildSiteUrl(meta.siteUrl, basePath, meta.path);
  const title = meta.title === "Signal Notes" ? meta.title : `${meta.title} | Signal Notes`;
  const app = renderToString(<PageShell basePath={basePath}>{page}</PageShell>);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <link rel="alternate" type="application/rss+xml" title="Signal Notes RSS" href="${escapeHtml(buildSiteUrl(meta.siteUrl, basePath, "/feed.xml"))}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:image" content="${escapeHtml(buildSiteUrl(meta.siteUrl, basePath, "/signal-notes-og.png"))}" />
    <meta name="theme-color" content="#151515" />
    <link rel="icon" href="${escapeHtml(withBasePath("/favicon.svg", basePath))}" type="image/svg+xml" />
    <link rel="stylesheet" href="${escapeHtml(withBasePath("/styles.css", basePath))}" />
    <script type="module" src="${escapeHtml(withBasePath("/app.js", basePath))}"></script>
  </head>
  <body>
    <div id="root">${app}</div>
  </body>
</html>`;
}
