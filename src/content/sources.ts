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
  },
  {
    slug: "nist-materials",
    name: "NIST Materials",
    type: "site",
    url: "https://www.nist.gov/news-events/materials",
    description: "NIST materials news and research updates for measurement science, standards, and material behavior.",
    topicSlugs: ["material-quality", "metrology", "source-trails"]
  },
  {
    slug: "nist-manufacturing",
    name: "NIST Manufacturing",
    type: "site",
    url: "https://www.nist.gov/news-events/manufacturing",
    description: "Manufacturing research and standards updates that can reveal process quality and inspection trends.",
    topicSlugs: ["material-quality", "metrology", "source-trails"]
  },
  {
    slug: "nist-srm",
    name: "NIST Standard Reference Materials",
    type: "docs",
    url: "https://www.nist.gov/srm",
    description: "Reference material catalog and program context for traceable calibration and measurement confidence.",
    topicSlugs: ["material-quality", "metrology", "source-trails"]
  },
  {
    slug: "doe-ammto",
    name: "DOE AMMTO",
    type: "site",
    url: "https://www.energy.gov/cmei/ammto/advanced-materials-and-manufacturing-technologies-office",
    description:
      "Advanced materials, manufacturing, critical minerals, and supply-chain program signals from the U.S. Department of Energy.",
    topicSlugs: ["critical-materials", "material-quality", "source-trails"]
  },
  {
    slug: "materials-project",
    name: "Materials Project",
    type: "docs",
    url: "https://docs.materialsproject.org/downloading-data/using-the-api",
    description: "Materials data API documentation for querying computed structures, properties, and provenance fields.",
    topicSlugs: ["material-quality", "data-quality", "source-trails"]
  },
  {
    slug: "nasa-technology",
    name: "NASA Technology",
    type: "site",
    url: "https://www.nasa.gov/technology/",
    description: "NASA technology updates that often surface early aerospace materials, inspection, and reliability signals.",
    topicSlugs: ["material-quality", "critical-materials", "source-trails"]
  }
];
