# Signal Notes

Signal Notes is a Bun-native React site for public notes about useful tools, AI workflows, sources, and practical patterns.

This is the standalone Signal Notes codebase. SpaceStatic can link to it as a resource, but this repo owns the Signal Notes app itself.

The v1 surface is intentionally small:

- public SSR pages rendered through `Bun.serve`
- repo-authored typed content
- RSS/Atom feed ingestion with cache and graceful fallback
- JSON and RSS public interfaces
- material quality stats and leading-edge indicator tracking
- Bun tests for content, routing, feeds, and core pages

## Requirements

- Bun `1.3.13+`

If Bun is not on your path:

```bash
curl -fsSL https://bun.sh/install | bash
exec /bin/zsh
```

## Commands

```bash
bun install
bun run generate:og
bun run dev
bun test
bun run typecheck
```

The dev server defaults to [http://localhost:3001](http://localhost:3001) so it can run beside the SpaceStatic site on `localhost:3000`. Set `PORT` or `SITE_URL` in the environment to override the local port or canonical URL.

When Signal Notes is mounted under SpaceStatic Info, run it with a base path:

```bash
SITE_URL=https://spacestatic.info BASE_PATH=/signal-notes bun run start
```

With `BASE_PATH=/signal-notes`, pages, assets, JSON, and RSS are served below `/signal-notes/*` so `spacestatic.info/signal-notes/materials`, `spacestatic.info/signal-notes/api/material-quality.json`, and the rest of the app share the same public subtree.

## Routes

- `/`
- `/topics`
- `/topics/:slug`
- `/materials`
- `/signals/:slug`
- `/sources`
- `/feed.xml`
- `/api/signals.json`
- `/api/material-quality.json`

## Material quality tracker

The `/materials` route tracks repo-authored baseline indicators for:

- calibration traceability
- lot-to-lot variance drift
- process capability
- non-destructive inspection coverage
- critical material exposure
- digital thread completeness
- scrap/rework rate
- accelerated-aging evidence

It also pulls automated source context through RSS feeds from NIST Materials, NIST Manufacturing, and NASA Technology. The JSON endpoint is intentionally simple so future connectors can replace the starter baselines with live sensor, supplier, spreadsheet, or materials API data.
