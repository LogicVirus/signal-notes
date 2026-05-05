import type { Source } from "./types";

export const sources: Source[] = [
  {
    slug: "bun-docs",
    name: "Bun Docs",
    type: "docs",
    url: "https://bun.sh/docs",
    description: "Primary docs for Bun runtime, server APIs, bundling, package management, and testing.",
    topicSlugs: ["web-stack", "developer-tools"]
  },
  {
    slug: "openai-docs",
    name: "OpenAI Docs",
    type: "docs",
    url: "https://platform.openai.com/docs",
    description: "Primary API and model documentation for building AI features and agent-facing workflows.",
    topicSlugs: ["ai-workflows", "source-trails"]
  },
  {
    slug: "openai-news",
    name: "OpenAI News",
    type: "blog",
    url: "https://openai.com/news",
    description: "Product, research, and platform updates that can change how AI workflows are built.",
    topicSlugs: ["ai-workflows", "source-trails"]
  },
  {
    slug: "vercel-changelog",
    name: "Vercel Changelog",
    type: "blog",
    url: "https://vercel.com/changelog",
    description: "Release notes and product changes for deployment, frontend infrastructure, and AI app hosting.",
    topicSlugs: ["web-stack", "source-trails"]
  },
  {
    slug: "github-blog",
    name: "GitHub Blog",
    type: "blog",
    url: "https://github.blog",
    description: "Developer platform news, release notes, workflow patterns, and ecosystem updates.",
    topicSlugs: ["developer-tools", "source-trails"]
  }
];
