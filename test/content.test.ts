import { describe, expect, test } from "bun:test";
import { feeds, materialQualityIndicators, signals, sources, topics, trackedMaterials, validateContent } from "../src/content";

describe("content model", () => {
  test("content references are valid", () => {
    expect(validateContent()).toEqual([]);
  });

  test("slugs are unique inside each collection", () => {
    for (const collection of [topics, sources, signals, feeds, materialQualityIndicators, trackedMaterials]) {
      const slugs = collection.map((item) => item.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  test("manual signals are useful public objects", () => {
    expect(signals.length).toBeGreaterThanOrEqual(5);
    expect(signals.every((signal) => signal.title && signal.summary && signal.body.length > 0)).toBe(true);
  });

  test("material quality tracker has useful baselines", () => {
    expect(materialQualityIndicators.length).toBeGreaterThanOrEqual(8);
    expect(trackedMaterials.length).toBeGreaterThanOrEqual(5);
    expect(materialQualityIndicators.some((indicator) => indicator.status === "risk")).toBe(true);
    expect(trackedMaterials.every((material) => material.leadingIndicators.length >= 3)).toBe(true);
  });
});
