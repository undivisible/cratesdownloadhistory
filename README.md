# crates download history

Star-history-style download charts for crates.io users. Astro + TypeScript, deployed on Cloudflare Workers via Wrangler.

## dev

```bash
npm install
npm run dev
```

## deploy

```bash
npm run deploy
```

Requires a Cloudflare account (`wrangler login`).

## routes

| path | description |
|------|-------------|
| `/` | user lookup |
| `/:user` | chart + embed snippets |
| `/embed/:user` | minimal iframe embed |
| `/api/svg/:user` | SVG for README badges |
| `/api/data/:user` | JSON download history |

## readme embed

```markdown
[![crates.io download history](https://crates-download-history.undivisible.workers.dev/api/svg/alexcrichton)](https://crates-download-history.undivisible.workers.dev/alexcrichton)
```