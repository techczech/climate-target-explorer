---
title: climate-target-explorer Pages preview deployment
date: 2026-11-19
register: FOR AGENTS
---

# Pages preview deployment

Cloudflare Pages project: `climate-target-explorer`. Preview: https://climate-target-explorer.pages.dev/ .
Production canonical and citation URL: https://climatetargetexplorer.edutools.fyi/ .
This phase attaches no custom domains and changes no DNS or Cloud Run services.

From a clean checkout with no build secrets:

```sh
npm install
npm run build
env -u CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID=b6ae5bced06492ee6f0c8f92776804da npx wrangler@4 pages deploy dist --project-name climate-target-explorer --branch main --force
```

Wrangler 4.165 requires `--force` to use the original Pages API directly instead of delegating to Workers. The project's pages.dev address is for review only; production switching requires separate approval.

AI feature needs a server: yes. The existing Gemini features have no server-held key on this static preview.
