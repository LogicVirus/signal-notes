import { feeds } from "./feeds";
import { signals } from "./signals";
import { sources } from "./sources";
import { topics } from "./topics";
import type { ContentIssue, FeedConfig, PublicSignal, Signal, Source, Topic } from "./types";

function bySlug<T extends { slug: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.slug, item]));
}

export const topicBySlug = bySlug(topics);
export const sourceBySlug = bySlug(sources);
export const signalBySlug = bySlug(signals);
export const feedBySlug = bySlug(feeds);

export function getTopic(slug: string): Topic | undefined {
  return topicBySlug.get(slug);
}

export function getSource(slug: string): Source | undefined {
  return sourceBySlug.get(slug);
}

export function getSignal(slug: string): PublicSignal | undefined {
  return getManualSignals().find((signal) => signal.slug === slug);
}

export function getTopicSignals(slug: string): PublicSignal[] {
  return getManualSignals().filter((signal) => signal.topicSlugs.includes(slug));
}

export function getManualSignals(): PublicSignal[] {
  return signals
    .map(enrichSignal)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function getEnabledFeeds(): FeedConfig[] {
  return feeds.filter((feed) => feed.enabled);
}

export function validateContent(): ContentIssue[] {
  const issues: ContentIssue[] = [];

  collectDuplicateIssues("topics", topics, issues);
  collectDuplicateIssues("sources", sources, issues);
  collectDuplicateIssues("signals", signals, issues);
  collectDuplicateIssues("feeds", feeds, issues);

  for (const source of sources) {
    for (const topicSlug of source.topicSlugs) {
      if (!topicBySlug.has(topicSlug)) {
        issues.push({
          collection: "sources",
          slug: source.slug,
          message: `Unknown topic reference: ${topicSlug}`
        });
      }
    }
  }

  for (const signal of signals) {
    if (!sourceBySlug.has(signal.sourceSlug)) {
      issues.push({
        collection: "signals",
        slug: signal.slug,
        message: `Unknown source reference: ${signal.sourceSlug}`
      });
    }

    for (const topicSlug of signal.topicSlugs) {
      if (!topicBySlug.has(topicSlug)) {
        issues.push({
          collection: "signals",
          slug: signal.slug,
          message: `Unknown topic reference: ${topicSlug}`
        });
      }
    }

    if (Number.isNaN(Date.parse(signal.publishedAt))) {
      issues.push({
        collection: "signals",
        slug: signal.slug,
        message: `Invalid publishedAt date: ${signal.publishedAt}`
      });
    }
  }

  for (const feed of feeds) {
    if (!sourceBySlug.has(feed.sourceSlug)) {
      issues.push({
        collection: "feeds",
        slug: feed.slug,
        message: `Unknown source reference: ${feed.sourceSlug}`
      });
    }

    for (const topicSlug of feed.topicSlugs) {
      if (!topicBySlug.has(topicSlug)) {
        issues.push({
          collection: "feeds",
          slug: feed.slug,
          message: `Unknown topic reference: ${topicSlug}`
        });
      }
    }
  }

  return issues;
}

function enrichSignal(signal: Signal): PublicSignal {
  const source = sourceBySlug.get(signal.sourceSlug);
  const signalTopics = signal.topicSlugs.map((slug) => topicBySlug.get(slug)).filter(Boolean) as Topic[];

  if (!source || signalTopics.length !== signal.topicSlugs.length) {
    return {
      ...signal,
      id: `manual:${signal.slug}`,
      topics: signalTopics,
      source: source ?? sources[0],
      origin: "manual",
      featured: Boolean(signal.featured)
    };
  }

  return {
    ...signal,
    id: `manual:${signal.slug}`,
    topics: signalTopics,
    source,
    origin: "manual",
    featured: Boolean(signal.featured)
  };
}

function collectDuplicateIssues(
  collection: ContentIssue["collection"],
  items: Array<{ slug: string }>,
  issues: ContentIssue[]
) {
  const seen = new Set<string>();

  for (const item of items) {
    if (seen.has(item.slug)) {
      issues.push({
        collection,
        slug: item.slug,
        message: `Duplicate slug: ${item.slug}`
      });
      continue;
    }

    seen.add(item.slug);
  }
}

export { feeds, signals, sources, topics };
export type { FeedConfig, PublicSignal, Signal, Source, Topic };
