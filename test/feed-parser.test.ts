import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { parseFeed } from "../src/services/feed-parser";
import { getFeedSignals } from "../src/services/feed-service";

describe("feed parsing", () => {
  test("parses RSS fixtures", () => {
    const xml = readFileSync("test/fixtures/sample-rss.xml", "utf8");
    const items = parseFeed(xml);

    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("New agent workflow notes");
    expect(items[0].summary).toBe("A short note about feed-driven workflow tracking.");
    expect(items[0].url).toBe("https://example.com/agent-workflow");
  });

  test("parses Atom fixtures", () => {
    const xml = readFileSync("test/fixtures/sample-atom.xml", "utf8");
    const items = parseFeed(xml);

    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("Bun server pattern");
    expect(items[0].summary).toBe("React SSR with a small Bun server.");
    expect(items[0].url).toBe("https://example.com/bun-server");
  });

  test("normalizes fetched feed items into public signals", async () => {
    const xml = readFileSync("test/fixtures/sample-rss.xml", "utf8");
    const result = await getFeedSignals({
      now: Date.parse("2026-05-04T18:00:00Z"),
      feeds: [
        {
          slug: "fixture-feed",
          sourceSlug: "github-blog",
          url: "https://example.com/feed.xml",
          topicSlugs: ["developer-tools"],
          enabled: true,
          maxItems: 2
        }
      ],
      fetcher: async () => new Response(xml)
    });

    expect(result.errors).toEqual([]);
    expect(result.signals).toHaveLength(1);
    expect(result.signals[0].origin).toBe("feed");
    expect(result.signals[0].sourceSlug).toBe("github-blog");
    expect(result.signals[0].topicSlugs).toEqual(["developer-tools"]);
  });
});
