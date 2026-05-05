import type { FeedConfig } from "./types";

export const feeds: FeedConfig[] = [
  {
    slug: "bun-rss",
    sourceSlug: "bun-docs",
    url: "https://bun.sh/rss.xml",
    topicSlugs: ["web-stack", "source-trails"],
    enabled: true,
    maxItems: 4
  },
  {
    slug: "github-blog",
    sourceSlug: "github-blog",
    url: "https://github.blog/feed/",
    topicSlugs: ["developer-tools", "source-trails"],
    enabled: true,
    maxItems: 4
  },
  {
    slug: "openai-news",
    sourceSlug: "openai-news",
    url: "https://openai.com/news/rss.xml",
    topicSlugs: ["ai-workflows", "source-trails"],
    enabled: true,
    maxItems: 4
  }
];
