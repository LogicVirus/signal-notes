import { createRequestHandler } from "../src/server.tsx";

const handler = createRequestHandler({
  siteUrl: process.env.SITE_URL ?? "https://spacestatic.info",
  basePath: process.env.BASE_PATH ?? "/signal-notes"
});

export default {
  fetch(request: Request) {
    return handler(request);
  }
};
