import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getManualSignals, getSignal, getTopic, sources, topics, validateContent } from "./content";
import type { PublicSignal } from "./content/types";
import { renderDocument } from "./render";
import { matchRoute } from "./router";
import { getFeedSignals, type FetchLike } from "./services/feed-service";
import { renderRss } from "./services/rss";
import { HomePage, NotFoundPage, SignalPage, SourcesPage, TopicPage, TopicsPage } from "./ui/components";

type RequestHandlerOptions = {
  siteUrl?: string;
  includeFeeds?: boolean;
  feedFetcher?: FetchLike;
};

type ServerOptions = RequestHandlerOptions & {
  port?: number;
  hostname?: string;
  log?: boolean;
};

const publicRoot = fileURLToPath(new URL("../public/", import.meta.url));
const assetTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"]
]);

export function createRequestHandler(options: RequestHandlerOptions = {}) {
  const siteUrl = withoutTrailingSlash(options.siteUrl ?? process.env.SITE_URL ?? "http://localhost:3001");
  const includeFeeds = options.includeFeeds ?? process.env.DISABLE_FEEDS !== "1";

  return async function handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const route = matchRoute(url.pathname);

    if (route.name === "asset") {
      return serveAsset(route.path);
    }

    if (route.name === "api-signals") {
      const signalSet = await collectSignals({ includeFeeds, feedFetcher: options.feedFetcher });

      return jsonResponse({
        site: "Signal Notes",
        count: signalSet.signals.length,
        refreshedAt: signalSet.refreshedAt,
        feedErrors: signalSet.feedErrors,
        signals: signalSet.signals
      });
    }

    if (route.name === "feed") {
      const signalSet = await collectSignals({ includeFeeds, feedFetcher: options.feedFetcher });
      return new Response(renderRss(signalSet.signals, siteUrl), {
        headers: {
          "content-type": "application/rss+xml; charset=utf-8",
          "cache-control": "public, max-age=300"
        }
      });
    }

    if (route.name === "home") {
      const signalSet = await collectSignals({ includeFeeds, feedFetcher: options.feedFetcher });
      return htmlResponse(
        renderDocument(<HomePage signals={signalSet.signals} topics={topics} feedErrors={signalSet.feedErrors} />, {
          title: "Signal Notes",
          description: "A public index of tools, AI workflows, source trails, and practical web stack notes.",
          path: "/",
          siteUrl
        })
      );
    }

    if (route.name === "topics") {
      const signalSet = await collectSignals({ includeFeeds, feedFetcher: options.feedFetcher });
      return htmlResponse(
        renderDocument(<TopicsPage topics={topics} signals={signalSet.signals} />, {
          title: "Topics",
          description: "Browse Signal Notes by topic: AI workflows, developer tools, web stack, and source trails.",
          path: "/topics",
          siteUrl
        })
      );
    }

    if (route.name === "topic") {
      const topic = getTopic(route.slug);

      if (!topic) {
        return notFound(siteUrl, url.pathname);
      }

      const signalSet = await collectSignals({ includeFeeds, feedFetcher: options.feedFetcher });
      const topicSignals = signalSet.signals.filter((signal) => signal.topicSlugs.includes(topic.slug));

      return htmlResponse(
        renderDocument(<TopicPage topic={topic} signals={topicSignals} />, {
          title: topic.name,
          description: topic.summary,
          path: `/topics/${topic.slug}`,
          siteUrl
        })
      );
    }

    if (route.name === "signal") {
      const signal = getSignal(route.slug);

      if (!signal) {
        return notFound(siteUrl, url.pathname);
      }

      return htmlResponse(
        renderDocument(<SignalPage signal={signal} />, {
          title: signal.title,
          description: signal.summary,
          path: `/signals/${signal.slug}`,
          siteUrl
        })
      );
    }

    if (route.name === "sources") {
      return htmlResponse(
        renderDocument(<SourcesPage sources={sources} />, {
          title: "Sources",
          description: "The primary docs, feeds, and sites behind Signal Notes.",
          path: "/sources",
          siteUrl
        })
      );
    }

    return notFound(siteUrl, url.pathname);
  };
}

export function createServer(options: ServerOptions = {}) {
  const port = options.port ?? Number(process.env.PORT ?? 3001);
  const handler = createRequestHandler({
    siteUrl: options.siteUrl ?? process.env.SITE_URL ?? `http://localhost:${port}`,
    includeFeeds: options.includeFeeds,
    feedFetcher: options.feedFetcher
  });

  const issues = validateContent();
  if (issues.length > 0) {
    throw new Error(`Content validation failed:\n${issues.map((issue) => `- ${issue.collection}/${issue.slug}: ${issue.message}`).join("\n")}`);
  }

  const server = Bun.serve({
    port,
    hostname: options.hostname ?? "0.0.0.0",
    fetch: handler
  });

  if (options.log ?? true) {
    console.log(`Signal Notes listening on http://${server.hostname}:${server.port}`);
  }

  return server;
}

async function collectSignals({
  includeFeeds,
  feedFetcher
}: {
  includeFeeds: boolean;
  feedFetcher?: FetchLike;
}): Promise<{ signals: PublicSignal[]; feedErrors: string[]; refreshedAt: string }> {
  const manualSignals = getManualSignals();

  if (!includeFeeds) {
    return {
      signals: manualSignals,
      feedErrors: [],
      refreshedAt: new Date().toISOString()
    };
  }

  const feedResult = await getFeedSignals({ fetcher: feedFetcher });

  return {
    signals: [...manualSignals, ...feedResult.signals].sort(
      (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
    ),
    feedErrors: feedResult.errors,
    refreshedAt: feedResult.refreshedAt
  };
}

function serveAsset(pathname: string): Response {
  const filePath = fileURLToPath(new URL(`../public${pathname}`, import.meta.url));

  if (!filePath.startsWith(publicRoot) || !existsSync(filePath)) {
    return new Response("Not found", { status: 404 });
  }

  const extension = pathname.match(/\.[a-z0-9]+$/)?.[0] ?? "";
  return new Response(Bun.file(filePath), {
    headers: {
      "content-type": assetTypes.get(extension) ?? "application/octet-stream",
      "cache-control": extension === ".png" ? "public, max-age=31536000, immutable" : "public, max-age=60"
    }
  });
}

function notFound(siteUrl: string, path: string): Response {
  return htmlResponse(
    renderDocument(<NotFoundPage />, {
      title: "Not found",
      description: "This Signal Notes page could not be found.",
      path,
      siteUrl
    }),
    404
  );
}

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8"
    }
  });
}

function jsonResponse(value: unknown): Response {
  return new Response(JSON.stringify(value, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=120"
    }
  });
}

function withoutTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

if (import.meta.main) {
  createServer();
}
