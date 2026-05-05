export type RouteMatch =
  | { name: "home" }
  | { name: "topics" }
  | { name: "topic"; slug: string }
  | { name: "materials" }
  | { name: "cloud" }
  | { name: "signal"; slug: string }
  | { name: "sources" }
  | { name: "feed" }
  | { name: "api-signals" }
  | { name: "api-material-quality" }
  | { name: "api-cloud" }
  | { name: "asset"; path: string }
  | { name: "not-found" };

export function matchRoute(pathname: string): RouteMatch {
  const path = normalizePath(pathname);

  if (path === "/") {
    return { name: "home" };
  }

  if (path === "/topics") {
    return { name: "topics" };
  }

  if (path.startsWith("/topics/")) {
    return { name: "topic", slug: path.slice("/topics/".length) };
  }

  if (path === "/materials") {
    return { name: "materials" };
  }

  if (path === "/cloud") {
    return { name: "cloud" };
  }

  if (path.startsWith("/signals/")) {
    return { name: "signal", slug: path.slice("/signals/".length) };
  }

  if (path === "/sources") {
    return { name: "sources" };
  }

  if (path === "/feed.xml") {
    return { name: "feed" };
  }

  if (path === "/api/signals.json") {
    return { name: "api-signals" };
  }

  if (path === "/api/material-quality.json") {
    return { name: "api-material-quality" };
  }

  if (path === "/api/cloud.json") {
    return { name: "api-cloud" };
  }

  if (["/styles.css", "/app.js", "/favicon.svg", "/signal-notes-og.png"].includes(path)) {
    return { name: "asset", path };
  }

  return { name: "not-found" };
}

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}
