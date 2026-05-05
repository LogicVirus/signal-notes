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
  },
  {
    slug: "material-quality",
    name: "Material Quality",
    summary: "Measurement quality, lot variation, inspection coverage, process capability, and durability signals.",
    accent: "#3d6477",
    tags: ["materials", "quality", "metrology"]
  },
  {
    slug: "critical-materials",
    name: "Critical Materials",
    summary: "Supply exposure, recovery, substitution, feedstock purity, and manufacturing resilience indicators.",
    accent: "#7d5a2b",
    tags: ["supply-chain", "minerals", "resilience"]
  },
  {
    slug: "metrology",
    name: "Metrology",
    summary: "Traceability, uncertainty, calibration, reference materials, and measurement-system readiness.",
    accent: "#5f6f3a",
    tags: ["calibration", "standards", "measurement"]
  },
  {
    slug: "data-quality",
    name: "Data Quality",
    summary: "Completeness, provenance, machine-readable contracts, and confidence signals behind every dataset.",
    accent: "#4f3d75",
    tags: ["data", "provenance", "apis"]
  }
];
