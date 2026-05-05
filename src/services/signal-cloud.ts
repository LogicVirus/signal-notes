import type { MaterialQualityIndicator, PublicSignal, Source, Topic, TrackedMaterial } from "../content/types";

export type SignalCloudNodeKind = "signal" | "topic" | "source" | "indicator" | "material" | "tag";

export type SignalCloudNode = {
  id: string;
  kind: SignalCloudNodeKind;
  slug: string;
  label: string;
  summary: string;
  href?: string;
  weight: number;
  radius: number;
  x: number;
  y: number;
  accent: string;
  status?: "stable" | "watch" | "risk";
};

export type SignalCloudLinkKind =
  | "signal-topic"
  | "signal-source"
  | "signal-tag"
  | "topic-source"
  | "indicator-topic"
  | "indicator-signal"
  | "indicator-source"
  | "material-topic"
  | "material-source"
  | "material-indicator"
  | "material-tag"
  | "signal-cluster";

export type SignalCloudLink = {
  id: string;
  source: string;
  target: string;
  kind: SignalCloudLinkKind;
  weight: number;
};

export type SignalCloudGraph = {
  generatedAt: string;
  width: number;
  height: number;
  gridSize: number;
  metrics: {
    nodes: number;
    links: number;
    densityScore: number;
    liveSignals: number;
    riskNodes: number;
    strongestNode: string;
  };
  nodes: SignalCloudNode[];
  links: SignalCloudLink[];
};

type BuildSignalCloudInput = {
  signals: PublicSignal[];
  topics: Topic[];
  sources: Source[];
  indicators: MaterialQualityIndicator[];
  materials: TrackedMaterial[];
  generatedAt: string;
};

const graphWidth = 1180;
const graphHeight = 720;
const gridSize = 20;
const defaultAccent = "#6ee7f9";
const sourceAccent = "#a9b7c9";
const signalAccent = "#66f0ff";
const tagAccent = "#d7f8ff";
const materialAccent = "#f5d46b";

export function buildSignalCloud({
  signals,
  topics,
  sources,
  indicators,
  materials,
  generatedAt
}: BuildSignalCloudInput): SignalCloudGraph {
  const nodes = new Map<string, SignalCloudNode>();
  const links = new Map<string, SignalCloudLink>();
  const topicSignalCount = countBy(signals.flatMap((signal) => signal.topicSlugs));
  const sourceSignalCount = countBy(signals.map((signal) => signal.sourceSlug));
  const tagCounts = countBy([
    ...signals.flatMap((signal) => signal.tags),
    ...indicators.flatMap((indicator) => indicator.tags),
    ...materials.flatMap((material) => material.leadingIndicators)
  ]);
  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 30)
    .map(([tag]) => tag);
  const topTagsSet = new Set(topTags);

  topics.forEach((topic, index) => {
    const weight = 6 + (topicSignalCount.get(topic.slug) ?? 0);
    const y = distribute(index, topics.length, 125, 610);
    addNode(nodes, {
      id: nodeId("topic", topic.slug),
      kind: "topic",
      slug: topic.slug,
      label: topic.name,
      summary: topic.summary,
      href: `/topics/${topic.slug}`,
      weight,
      x: 365,
      y,
      accent: topic.accent
    });
  });

  sources.forEach((source, index) => {
    const count = sourceSignalCount.get(source.slug) ?? 0;
    const y = distribute(index, sources.length, 105, 620);
    addNode(nodes, {
      id: nodeId("source", source.slug),
      kind: "source",
      slug: source.slug,
      label: source.name,
      summary: source.description,
      href: source.url,
      weight: 3 + count,
      x: 95,
      y,
      accent: sourceAccent
    });

    for (const topicSlug of source.topicSlugs) {
      addLink(links, nodes, nodeId("source", source.slug), nodeId("topic", topicSlug), "topic-source", 1.5);
    }
  });

  topTags.forEach((tag, index) => {
    const row = Math.floor(index / 10);
    const col = index % 10;

    addNode(nodes, {
      id: nodeId("tag", normalizeTag(tag)),
      kind: "tag",
      slug: normalizeTag(tag),
      label: tag,
      summary: `Recurring signal marker across the current index: ${tag}.`,
      weight: 2 + (tagCounts.get(tag) ?? 0),
      x: snap(205 + col * 93),
      y: snap(36 + row * 34),
      accent: tagAccent
    });
  });

  signals.forEach((signal, index) => {
    const columns = Math.min(7, Math.max(4, Math.ceil(Math.sqrt(Math.max(signals.length, 1)))));
    const rows = Math.max(1, Math.ceil(signals.length / columns));
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = distribute(col, columns, 555, 1085);
    const y = distribute(row, rows, 150, 555);
    const href = signal.origin === "manual" ? `/signals/${signal.slug}` : signal.url;

    addNode(nodes, {
      id: nodeId("signal", signal.slug),
      kind: "signal",
      slug: signal.slug,
      label: signal.title,
      summary: signal.summary,
      href,
      weight: 3 + signal.topicSlugs.length + signal.tags.length * 0.35 + (signal.featured ? 3 : 0),
      x,
      y,
      accent: signal.featured ? "#f5d46b" : signalAccent
    });

    addLink(links, nodes, nodeId("signal", signal.slug), nodeId("source", signal.sourceSlug), "signal-source", 1.6);

    for (const topicSlug of signal.topicSlugs) {
      addLink(links, nodes, nodeId("signal", signal.slug), nodeId("topic", topicSlug), "signal-topic", 2);
    }

    for (const tag of signal.tags) {
      if (topTagsSet.has(tag)) {
        addLink(links, nodes, nodeId("signal", signal.slug), nodeId("tag", normalizeTag(tag)), "signal-tag", 1);
      }
    }
  });

  indicators.forEach((indicator, index) => {
    addNode(nodes, {
      id: nodeId("indicator", indicator.slug),
      kind: "indicator",
      slug: indicator.slug,
      label: indicator.title,
      summary: indicator.summary,
      weight: 5 + statusWeight(indicator.status),
      x: distribute(index, indicators.length, 190, 720),
      y: snap(index % 2 === 0 ? 638 : 684),
      accent: statusAccent(indicator.status),
      status: indicator.status
    });

    addLink(links, nodes, nodeId("indicator", indicator.slug), nodeId("source", indicator.sourceSlug), "indicator-source", 1.4);

    for (const topicSlug of indicator.topicSlugs) {
      addLink(links, nodes, nodeId("indicator", indicator.slug), nodeId("topic", topicSlug), "indicator-topic", 2.4);
    }

    for (const signalSlug of indicator.signalSlugs) {
      addLink(links, nodes, nodeId("indicator", indicator.slug), nodeId("signal", signalSlug), "indicator-signal", 2);
    }
  });

  materials.forEach((material, index) => {
    addNode(nodes, {
      id: nodeId("material", material.slug),
      kind: "material",
      slug: material.slug,
      label: material.name,
      summary: material.summary,
      weight: 5 + material.qualityStats.filter((stat) => stat.status !== "stable").length,
      x: distribute(index, materials.length, 790, 1090),
      y: snap(index % 2 === 0 ? 620 : 675),
      accent: materialAccent,
      status: material.qualityStats.some((stat) => stat.status === "risk") ? "risk" : "watch"
    });

    for (const topicSlug of material.topicSlugs) {
      addLink(links, nodes, nodeId("material", material.slug), nodeId("topic", topicSlug), "material-topic", 1.7);
    }

    for (const sourceSlug of material.sourceSlugs) {
      addLink(links, nodes, nodeId("material", material.slug), nodeId("source", sourceSlug), "material-source", 1.2);
    }

    for (const indicatorSlug of material.indicatorSlugs) {
      addLink(links, nodes, nodeId("material", material.slug), nodeId("indicator", indicatorSlug), "material-indicator", 2.3);
    }

    for (const tag of material.leadingIndicators.slice(0, 2)) {
      if (topTagsSet.has(tag)) {
        addLink(links, nodes, nodeId("material", material.slug), nodeId("tag", normalizeTag(tag)), "material-tag", 1);
      }
    }
  });

  for (const topic of topics) {
    const cluster = signals
      .filter((signal) => signal.topicSlugs.includes(topic.slug))
      .slice(0, 18);

    for (let index = 1; index < cluster.length; index += 1) {
      addLink(
        links,
        nodes,
        nodeId("signal", cluster[index - 1].slug),
        nodeId("signal", cluster[index].slug),
        "signal-cluster",
        0.7
      );
    }
  }

  const graphNodes = [...nodes.values()]
    .map((node) => ({
      ...node,
      radius: radiusForWeight(node.weight)
    }))
    .sort((a, b) => kindOrder(a.kind) - kindOrder(b.kind) || b.weight - a.weight || a.label.localeCompare(b.label));
  const graphLinks = [...links.values()].sort((a, b) => a.weight - b.weight || a.id.localeCompare(b.id));
  const strongestNode = [...graphNodes].sort((a, b) => b.weight - a.weight)[0];

  return {
    generatedAt,
    width: graphWidth,
    height: graphHeight,
    gridSize,
    metrics: {
      nodes: graphNodes.length,
      links: graphLinks.length,
      densityScore: Number((graphLinks.length / Math.max(1, graphNodes.length)).toFixed(2)),
      liveSignals: signals.length,
      riskNodes: graphNodes.filter((node) => node.status === "risk").length,
      strongestNode: strongestNode?.label ?? "Signal Notes"
    },
    nodes: graphNodes,
    links: graphLinks
  };
}

function addNode(nodes: Map<string, SignalCloudNode>, node: Omit<SignalCloudNode, "radius">) {
  const existing = nodes.get(node.id);

  if (existing) {
    existing.weight += node.weight;
    return;
  }

  nodes.set(node.id, {
    ...node,
    x: snap(node.x),
    y: snap(node.y),
    radius: radiusForWeight(node.weight)
  });
}

function addLink(
  links: Map<string, SignalCloudLink>,
  nodes: Map<string, SignalCloudNode>,
  source: string,
  target: string,
  kind: SignalCloudLinkKind,
  weight: number
) {
  if (source === target || !nodes.has(source) || !nodes.has(target)) {
    return;
  }

  const id = `${[source, target].sort().join("--")}--${kind}`;
  const existing = links.get(id);

  if (existing) {
    existing.weight += weight;
  } else {
    links.set(id, { id, source, target, kind, weight });
  }

  nodes.get(source)!.weight += weight * 0.18;
  nodes.get(target)!.weight += weight * 0.18;
}

function countBy(values: string[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return counts;
}

function distribute(index: number, total: number, min: number, max: number): number {
  if (total <= 1) {
    return snap((min + max) / 2);
  }

  return snap(min + (index / (total - 1)) * (max - min));
}

function radiusForWeight(weight: number): number {
  return Math.max(5, Math.min(19, 4 + Math.sqrt(weight) * 2.2));
}

function statusWeight(status: "stable" | "watch" | "risk"): number {
  if (status === "risk") {
    return 4;
  }

  if (status === "watch") {
    return 2;
  }

  return 0;
}

function statusAccent(status: "stable" | "watch" | "risk"): string {
  if (status === "risk") {
    return "#ff8a5c";
  }

  if (status === "watch") {
    return "#f5d46b";
  }

  return "#6ee7b7";
}

function kindOrder(kind: SignalCloudNodeKind): number {
  return ["topic", "source", "signal", "indicator", "material", "tag"].indexOf(kind);
}

function nodeId(kind: SignalCloudNodeKind, slug: string): string {
  return `${kind}:${slug}`;
}

function normalizeTag(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function snap(value: number): number {
  return Math.round(value / gridSize) * gridSize;
}
