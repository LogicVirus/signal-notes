import { getEnabledFeeds, getManualSignals, getSource, getTopic } from "../content";
import type { FeedConfig, PublicSignal, Topic } from "../content/types";
import { slugify } from "../utils/slug";
import { parseFeed } from "./feed-parser";

export type FeedIngestResult = {
  signals: PublicSignal[];
  errors: string[];
  refreshedAt: string;
};

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const FEED_CACHE_MS = 1000 * 60 * 15;
let cache: { expiresAt: number; result: FeedIngestResult } | undefined;

export async function getAllSignals(options: { includeFeeds?: boolean } = {}): Promise<PublicSignal[]> {
  const manualSignals = getManualSignals();

  if (options.includeFeeds === false) {
    return manualSignals;
  }

  const feedResult = await getFeedSignals();
  return [...manualSignals, ...feedResult.signals].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  );
}

export async function getFeedSignals(
  options: { now?: number; fetcher?: FetchLike; feeds?: FeedConfig[] } = {}
): Promise<FeedIngestResult> {
  const now = options.now ?? Date.now();

  if (!options.fetcher && !options.feeds && cache && cache.expiresAt > now) {
    return cache.result;
  }

  const fetcher = options.fetcher ?? fetch;
  const configuredFeeds = options.feeds ?? getEnabledFeeds();
  const errors: string[] = [];
  const signals: PublicSignal[] = [];

  await Promise.all(
    configuredFeeds.map(async (feed) => {
      const source = getSource(feed.sourceSlug);

      if (!source) {
        errors.push(`${feed.slug}: unknown source ${feed.sourceSlug}`);
        return;
      }

      try {
        const response = await fetcher(feed.url, {
          headers: {
            accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
            "user-agent": "SignalNotes/0.1 (+https://signal-notes.local)"
          },
          signal: AbortSignal.timeout(3500)
        });

        if (!response.ok) {
          errors.push(`${feed.slug}: ${response.status} ${response.statusText}`.trim());
          return;
        }

        const xml = await response.text();
        const items = parseFeed(xml, source.name).slice(0, feed.maxItems);

        signals.push(
          ...items.map((item) => {
            const topics = feed.topicSlugs.map(getTopic).filter(Boolean) as Topic[];
            const summary = trimSummary(item.summary);

            return {
              id: item.id,
              slug: `${feed.slug}-${slugify(item.title)}`,
              title: item.title,
              summary,
              body: [summary],
              kind: "source-note",
              publishedAt: item.publishedAt,
              topicSlugs: feed.topicSlugs,
              topics,
              sourceSlug: source.slug,
              source,
              tags: ["feed", source.type, ...topics.flatMap((topic) => topic.tags.slice(0, 1))],
              url: item.url,
              origin: "feed",
              featured: false
            } satisfies PublicSignal;
          })
        );
      } catch (error) {
        errors.push(`${feed.slug}: ${error instanceof Error ? error.message : "feed request failed"}`);
      }
    })
  );

  const result: FeedIngestResult = {
    signals: dedupeByUrl(signals).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)),
    errors,
    refreshedAt: new Date(now).toISOString()
  };

  if (!options.fetcher && !options.feeds) {
    cache = {
      expiresAt: now + FEED_CACHE_MS,
      result
    };
  }

  return result;
}

export function resetFeedCache() {
  cache = undefined;
}

function dedupeByUrl(signals: PublicSignal[]): PublicSignal[] {
  const seen = new Set<string>();
  const deduped: PublicSignal[] = [];

  for (const signal of signals) {
    const key = signal.url ?? signal.slug;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(signal);
  }

  return deduped;
}

function trimSummary(value: string, limit = 240): string {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= limit) {
    return normalized;
  }

  const sliced = normalized.slice(0, limit);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${sliced.slice(0, lastSpace > 120 ? lastSpace : limit).trim()}...`;
}
