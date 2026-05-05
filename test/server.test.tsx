import { describe, expect, test } from "bun:test";
import { createRequestHandler } from "../src/server";

const siteUrl = "https://signal-notes.test";

function request(path: string, handler = createRequestHandler({ siteUrl, includeFeeds: false })) {
  return handler(new Request(`${siteUrl}${path}`));
}

describe("public server routes", () => {
  test("renders the home workbench", async () => {
    const response = await request("/");
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("<h1 id=\"home-title\">Signal Notes</h1>");
    expect(html).toContain("data-signal-search");
    expect(html).toContain(`<link rel="canonical" href="${siteUrl}/"`);
  });

  test("renders core public pages", async () => {
    const paths = [
      "/topics",
      "/topics/ai-workflows",
      "/signals/bun-native-react-server",
      "/sources"
    ];

    for (const path of paths) {
      const response = await request(path);
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("text/html");
    }
  });

  test("returns normalized public JSON", async () => {
    const response = await request("/api/signals.json");
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.site).toBe("Signal Notes");
    expect(json.count).toBeGreaterThanOrEqual(5);
    expect(json.signals[0].origin).toBe("manual");
  });

  test("returns RSS XML", async () => {
    const response = await request("/feed.xml");
    const xml = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/rss+xml");
    expect(xml).toContain("<title>Signal Notes</title>");
    expect(xml).toContain("<item>");
  });

  test("serves public assets", async () => {
    const response = await request("/signal-notes-og.png");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
  });

  test("returns 404 for unknown paths", async () => {
    const response = await request("/missing");
    const html = await response.text();

    expect(response.status).toBe(404);
    expect(html).toContain("This signal is not in the index.");
  });

  test("feed failures do not break public pages", async () => {
    const handler = createRequestHandler({
      siteUrl,
      includeFeeds: true,
      feedFetcher: async () => new Response("temporary failure", { status: 503, statusText: "Unavailable" })
    });
    const response = await request("/", handler);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("Some live feeds are temporarily unavailable.");
    expect(html).toContain("Bun-native React can start as a very small server");
  });
});
