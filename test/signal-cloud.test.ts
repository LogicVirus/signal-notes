import { describe, expect, test } from "bun:test";
import {
  getManualSignals,
  materialQualityIndicators,
  sources,
  topics,
  trackedMaterials
} from "../src/content";
import type { PublicSignal } from "../src/content/types";
import { buildSignalCloud } from "../src/services/signal-cloud";

const generatedAt = "2026-05-05T12:00:00.000Z";

function buildGraph(signals = getManualSignals()) {
  return buildSignalCloud({
    signals,
    topics,
    sources,
    indicators: materialQualityIndicators,
    materials: trackedMaterials,
    generatedAt
  });
}

describe("signal cloud graph", () => {
  test("builds a weighted grid graph across the public content set", () => {
    const graph = buildGraph();
    const nodeKinds = new Set(graph.nodes.map((node) => node.kind));
    const linkKinds = new Set(graph.links.map((link) => link.kind));

    expect(graph.generatedAt).toBe(generatedAt);
    expect(graph.metrics.nodes).toBe(graph.nodes.length);
    expect(graph.metrics.links).toBe(graph.links.length);
    expect(graph.metrics.densityScore).toBeGreaterThan(1);
    expect(graph.metrics.strongestNode.length).toBeGreaterThan(0);

    for (const kind of ["signal", "topic", "source", "indicator", "material", "tag"] as const) {
      expect(nodeKinds.has(kind)).toBe(true);
    }

    for (const kind of ["signal-topic", "signal-source", "indicator-topic", "material-indicator"] as const) {
      expect(linkKinds.has(kind)).toBe(true);
    }

    expect(graph.nodes.every((node) => node.x % graph.gridSize === 0 && node.y % graph.gridSize === 0)).toBe(true);
    expect(graph.links.every((link) => graph.nodes.some((node) => node.id === link.source))).toBe(true);
    expect(graph.links.every((link) => graph.nodes.some((node) => node.id === link.target))).toBe(true);
  });

  test("grows as new signals are added", () => {
    const baseSignals = getManualSignals();
    const baseGraph = buildGraph(baseSignals);
    const source = sources.find((item) => item.slug === "nist-materials") ?? sources[0];
    const topicSlugs = ["material-quality", "metrology"];
    const newSignal: PublicSignal = {
      ...baseSignals[0],
      id: "manual:thermal-drift-quality-loop",
      slug: "thermal-drift-quality-loop",
      title: "Thermal drift belongs in the quality loop",
      summary: "A starter note that links thermal drift, measurement repeatability, and inspection coverage.",
      body: ["Thermal drift should be tracked beside material quality statistics when process windows tighten."],
      publishedAt: generatedAt,
      topicSlugs,
      topics: topics.filter((topic) => topicSlugs.includes(topic.slug)),
      sourceSlug: source.slug,
      source,
      tags: ["thermal drift", "inspection coverage", "measurement"],
      featured: false
    };
    const grownGraph = buildGraph([...baseSignals, newSignal]);

    expect(grownGraph.metrics.liveSignals).toBe(baseGraph.metrics.liveSignals + 1);
    expect(grownGraph.metrics.nodes).toBeGreaterThan(baseGraph.metrics.nodes);
    expect(grownGraph.metrics.links).toBeGreaterThan(baseGraph.metrics.links);
    expect(grownGraph.nodes.some((node) => node.id === "signal:thermal-drift-quality-loop")).toBe(true);
  });
});
