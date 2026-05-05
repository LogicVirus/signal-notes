import { describe, expect, test } from "bun:test";
import { matchRoute } from "../src/router";

describe("route matcher", () => {
  test("matches public routes", () => {
    expect(matchRoute("/")).toEqual({ name: "home" });
    expect(matchRoute("/topics")).toEqual({ name: "topics" });
    expect(matchRoute("/topics/ai-workflows")).toEqual({ name: "topic", slug: "ai-workflows" });
    expect(matchRoute("/materials")).toEqual({ name: "materials" });
    expect(matchRoute("/signals/bun-native-react-server")).toEqual({
      name: "signal",
      slug: "bun-native-react-server"
    });
    expect(matchRoute("/sources")).toEqual({ name: "sources" });
    expect(matchRoute("/feed.xml")).toEqual({ name: "feed" });
    expect(matchRoute("/api/signals.json")).toEqual({ name: "api-signals" });
    expect(matchRoute("/api/material-quality.json")).toEqual({ name: "api-material-quality" });
  });

  test("normalizes trailing slashes", () => {
    expect(matchRoute("/topics/")).toEqual({ name: "topics" });
  });

  test("matches static assets and misses unknown paths", () => {
    expect(matchRoute("/styles.css")).toEqual({ name: "asset", path: "/styles.css" });
    expect(matchRoute("/missing")).toEqual({ name: "not-found" });
  });
});
