import type { Signal } from "./types";

export const signals: Signal[] = [
  {
    slug: "bun-native-react-server",
    title: "Bun-native React can start as a very small server",
    summary:
      "A useful v1 does not need a heavy framework: `Bun.serve`, React SSR, typed content, and a few public routes are enough to prove the shape.",
    kind: "pattern",
    publishedAt: "2026-05-04T17:45:00-05:00",
    topicSlugs: ["web-stack", "developer-tools"],
    sourceSlug: "bun-docs",
    tags: ["bun", "react", "ssr"],
    featured: true,
    body: [
      "The first version of a public research site benefits from a thin server. It keeps the feedback loop fast while leaving room for richer data, auth, and agent surfaces later.",
      "The tradeoff is that routing, metadata, assets, and caching become explicit. That is acceptable here because those choices are part of the product language: small, legible, and easy to change."
    ]
  },
  {
    slug: "rss-is-the-cheapest-connector",
    title: "RSS is still the cheapest useful connector",
    summary:
      "Before building OAuth dashboards and sync jobs, RSS/Atom feeds can turn trusted sources into a living source trail.",
    kind: "workflow",
    publishedAt: "2026-05-04T17:30:00-05:00",
    topicSlugs: ["source-trails", "ai-workflows"],
    sourceSlug: "github-blog",
    tags: ["rss", "feeds", "curation"],
    featured: true,
    body: [
      "Feed ingestion is a good first connector because the failure mode is soft. If a feed is down, the site can still publish manual notes.",
      "The important product move is not the feed itself. It is the normalization layer: source, topic, summary, published date, and canonical URL become the shared shape for future integrations."
    ]
  },
  {
    slug: "agent-api-later-public-json-now",
    title: "Start with public JSON before a private agent API",
    summary:
      "A public `/api/signals.json` endpoint gives the content a machine-readable contract without committing to auth, writes, or assistants yet.",
    kind: "pattern",
    publishedAt: "2026-05-04T17:05:00-05:00",
    topicSlugs: ["ai-workflows", "web-stack"],
    sourceSlug: "openai-docs",
    tags: ["api", "agents", "contracts"],
    body: [
      "Machine-readable public data keeps the door open for future assistants while avoiding early write surfaces.",
      "Once the signal shape feels durable, a private API can reuse the same normalization and validation rules instead of inventing a second model."
    ]
  },
  {
    slug: "source-trails-beat-bookmarks",
    title: "Source trails beat bookmark piles",
    summary:
      "A good public note should show what it noticed, where it came from, and why it is worth returning to.",
    kind: "source-note",
    publishedAt: "2026-05-04T16:40:00-05:00",
    topicSlugs: ["source-trails"],
    sourceSlug: "vercel-changelog",
    tags: ["research", "notes", "links"],
    body: [
      "Bookmarks preserve URLs. Source trails preserve context.",
      "For Signal Notes, each item should carry a short judgment: what changed, why it matters, and which topic it belongs to."
    ]
  },
  {
    slug: "workflow-maps-over-generic-dashboards",
    title: "Workflow maps are stronger than generic dashboards",
    summary:
      "The homepage should behave like a working desk: filters, latest items, sources, and topic routes, not a brand-first splash page.",
    kind: "tool",
    publishedAt: "2026-05-04T16:10:00-05:00",
    topicSlugs: ["ai-workflows", "developer-tools"],
    sourceSlug: "openai-docs",
    tags: ["product", "ux", "systems"],
    featured: true,
    body: [
      "Public niche sites become useful when the first screen is already the tool.",
      "The landing page can still have voice, but the primary interaction should be scanning, filtering, and opening the trail behind a signal."
    ]
  },
  {
    slug: "measurement-graph-over-material-facts",
    title: "Material quality needs a measurement graph, not a shelf of facts",
    summary:
      "Useful material stats need traceability, uncertainty, lot context, and process capability attached before they become decision-grade.",
    kind: "pattern",
    publishedAt: "2026-05-05T00:15:00-05:00",
    topicSlugs: ["material-quality", "metrology", "data-quality"],
    sourceSlug: "nist-srm",
    tags: ["materials", "calibration", "traceability"],
    featured: true,
    body: [
      "A material property without a measurement trail is a loose number. The useful shape is a graph: property, method, instrument, reference material, uncertainty, lot, process window, and decision made from it.",
      "That is why the tracker starts with leading indicators such as calibration traceability, lot-to-lot variance, process capability, and scrap/rework rate. They move before the final product fails."
    ]
  },
  {
    slug: "critical-material-exposure-is-a-quality-signal",
    title: "Critical-material exposure is a quality signal before it is a procurement issue",
    summary:
      "Supply risk, substitution pressure, recovery options, and source concentration can affect material consistency before they show up as missing inventory.",
    kind: "source-note",
    publishedAt: "2026-05-05T00:05:00-05:00",
    topicSlugs: ["critical-materials", "material-quality"],
    sourceSlug: "doe-ammto",
    tags: ["critical-minerals", "supply-chain", "resilience"],
    url: "https://www.energy.gov/cmei/ammto/critical-minerals-and-materials",
    body: [
      "Critical materials should be tracked as part of quality, not only purchasing. If the source mix changes, impurity profile, documentation quality, and supplier process controls can change too.",
      "Signal Notes treats exposure as a leading indicator: when policy, funding, recovery, or substitution signals move, the material quality watchlist should update."
    ]
  },
  {
    slug: "materials-project-as-data-connector",
    title: "Materials Project makes computed-property trails connector-ready",
    summary:
      "The useful future is not only reading material pages; it is querying structures, properties, and provenance fields as part of a quality evidence trail.",
    kind: "workflow",
    publishedAt: "2026-05-04T23:55:00-05:00",
    topicSlugs: ["material-quality", "data-quality", "source-trails"],
    sourceSlug: "materials-project",
    tags: ["materials-project", "api", "provenance"],
    url: "https://docs.materialsproject.org/downloading-data/using-the-api/querying-data",
    body: [
      "Computed material data becomes more useful when it is attached to provenance and decision context. A quality tracker should know which values were measured, computed, inferred, or awaiting verification.",
      "The first API endpoint stays public and simple. Later, a connector can enrich tracked materials with selected Materials Project fields while preserving the same source-trail discipline."
    ]
  },
  {
    slug: "aerospace-material-signals-need-early-inspection",
    title: "Aerospace material signals belong near inspection and aging data",
    summary:
      "NASA technology updates are useful source material because aerospace environments expose weak inspection coverage, durability evidence, and thermal-risk assumptions.",
    kind: "source-note",
    publishedAt: "2026-05-04T23:45:00-05:00",
    topicSlugs: ["material-quality", "critical-materials", "source-trails"],
    sourceSlug: "nasa-technology",
    tags: ["aerospace", "inspection", "durability"],
    url: "https://www.nasa.gov/technology/",
    body: [
      "Aerospace is a forcing function for material quality. Thermal cycling, vibration, vacuum, radiation, and mission constraints make hidden weaknesses visible faster.",
      "The tracker watches aerospace technology signals alongside inspection coverage and accelerated-aging evidence so promising materials do not outrun their proof."
    ]
  }
];
