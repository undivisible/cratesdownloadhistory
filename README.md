# crates download history

Star-history-style download charts for crates.io users. Astro + TypeScript, deployed on Cloudflare Workers via Wrangler.

## dev

```bash
bun install
bun run dev
```

## deploy

```bash
bun run deploy
```

Requires a Cloudflare account (`wrangler login`).

## performance

Responses are cached in Cloudflare KV for 1 hour. Repeat requests are served
from cache (~50ms). Cold fetches parallelize crate API calls (20 concurrent)
and skip zero-download crates. Stale cache is served immediately while
refreshing in the background.

## routes

| path | description |
|------|-------------|
| `/` | user lookup |
| `/:user` | chart + embed snippets |
| `/embed/:user` | minimal iframe embed |
| `/api/svg/:user` | SVG for README badges |
| `/api/data/:user` | JSON download history |

## widget options

Append query params to embed/svg URLs:

| param | values | default |
|-------|--------|---------|
| `theme` | `light`, `dark`, `nord`, `taiga`, `sepia`, `tokyo-night`, `dracula`, `catppuccin`, `one-dark`, `octocat` | `light` |
| `date` | `mdy`, `mdy-long`, `dmy`, `dmy-long`, `ymd` | `mdy` |
| `font` | `mono`, `sans`, `serif` | `mono` |
| `crates` | `1`, `true` | off |

Aliases: `dd/mm/yyyy`, `dd/mm/yy`, `mm/dd/yyyy`, `yyyy-mm-dd`, `iso`

## readme embed

```markdown
[![crates.io download history](https://cratesdownloadhistory.undivisible.dev/api/svg/undivisible?theme=dark&date=dmy-long&crates=1)](https://crates.io/users/undivisible)
```