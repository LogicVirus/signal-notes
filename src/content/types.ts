export type SignalKind = "tool" | "workflow" | "pattern" | "source-note";

export type SourceType = "docs" | "newsletter" | "repo" | "site" | "blog";

export type Topic = {
  slug: string;
  name: string;
  summary: string;
  accent: string;
  tags: string[];
};

export type Source = {
  slug: string;
  name: string;
  type: SourceType;
  url: string;
  description: string;
  topicSlugs: string[];
};

export type Signal = {
  slug: string;
  title: string;
  summary: string;
  body: string[];
  kind: SignalKind;
  publishedAt: string;
  topicSlugs: string[];
  sourceSlug: string;
  tags: string[];
  url?: string;
  featured?: boolean;
};

export type FeedConfig = {
  slug: string;
  sourceSlug: string;
  url: string;
  topicSlugs: string[];
  enabled: boolean;
  maxItems: number;
};

export type FeedItem = {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  sourceTitle?: string;
};

export type PublicSignal = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string[];
  kind: SignalKind;
  publishedAt: string;
  topicSlugs: string[];
  topics: Topic[];
  sourceSlug: string;
  source: Source;
  tags: string[];
  url?: string;
  origin: "manual" | "feed";
  featured: boolean;
};

export type ContentIssue = {
  message: string;
  collection: "topics" | "sources" | "signals" | "feeds";
  slug: string;
};
