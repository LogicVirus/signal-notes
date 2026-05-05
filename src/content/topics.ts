import type { Topic } from "./types";

export const topics: Topic[] = [
  {
    slug: "ai-workflows",
    name: "AI Workflows",
    summary: "Agent patterns, promptable systems, human review loops, and durable automation ideas.",
    accent: "#0f6f68",
    tags: ["agents", "automation", "systems"]
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    summary: "Compilers, runtimes, IDEs, CLIs, SDKs, and the small utilities that change how work feels.",
    accent: "#a24d2b",
    tags: ["clis", "ides", "sdks"]
  },
  {
    slug: "web-stack",
    name: "Web Stack",
    summary: "Bun, React, deployment, routing, data fetching, edge/server tradeoffs, and frontend architecture.",
    accent: "#4f3d75",
    tags: ["bun", "react", "deployment"]
  },
  {
    slug: "source-trails",
    name: "Source Trails",
    summary: "Primary docs, changelogs, feeds, specs, and references worth keeping close.",
    accent: "#9b7a24",
    tags: ["docs", "feeds", "research"]
  }
];
