# Signal Notes

Signal Notes is a Bun-native React site for public notes about useful tools, AI workflows, sources, and practical patterns.

This is the standalone Signal Notes codebase. SpaceStatic can link to it as a resource, but this repo owns the Signal Notes app itself.

The v1 surface is intentionally small:

- public SSR pages rendered through `Bun.serve`
- repo-authored typed content
- RSS/Atom feed ingestion with cache and graceful fallback
- JSON and RSS public interfaces
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

## Routes

- `/`
- `/topics`
- `/topics/:slug`
- `/signals/:slug`
- `/sources`
- `/feed.xml`
- `/api/signals.json`
