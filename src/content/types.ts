export type SignalKind = "tool" | "workflow" | "pattern" | "source-note";

export type SourceType = "docs" | "newsletter" | "repo" | "site" | "blog";

export type IndicatorCategory = "metrology" | "process" | "durability" | "supply-chain" | "data-quality";

export type IndicatorStatus = "stable" | "watch" | "risk";

export type IndicatorTrend = "rising" | "falling" | "steady" | "mixed";

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

export type MaterialQualityIndicator = {
  slug: string;
  title: string;
  summary: string;
  category: IndicatorCategory;
  value: string;
  target: string;
  unit?: string;
  direction: "higher-better" | "lower-better" | "watch";
  status: IndicatorStatus;
  trend: IndicatorTrend;
  updatedAt: string;
  cadence: string;
  sourceSlug: string;
  topicSlugs: string[];
  signalSlugs: string[];
  tags: string[];
  whyItMatters: string;
};

export type TrackedMaterial = {
  slug: string;
  name: string;
  family: string;
  summary: string;
  updatedAt: string;
  topicSlugs: string[];
  sourceSlugs: string[];
  indicatorSlugs: string[];
  qualityStats: Array<{
    label: string;
    value: string;
    unit?: string;
    status: IndicatorStatus;
  }>;
  leadingIndicators: string[];
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
  collection: "topics" | "sources" | "signals" | "feeds" | "indicators" | "materials";
  slug: string;
};
