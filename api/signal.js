let handlerPromise;

async function getHandler() {
  handlerPromise ??= import("../dist/server.js").then(({ createRequestHandler }) =>
    createRequestHandler({
      siteUrl: process.env.SITE_URL ?? "https://spacestatic.info",
      basePath: process.env.BASE_PATH ?? "/signal-notes"
    })
  );

  return handlerPromise;
}

export default {
  async fetch(request) {
    const handler = await getHandler();
    return handler(request);
  }
};
