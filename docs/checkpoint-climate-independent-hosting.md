---
title: Climate Target Explorer independent hosting checkpoint
date: 2026-10-22
status: checked-awaiting-independent-review
---

# Plan

- Preserve all climate calculations, sliders and local exploration import/export without a key.
- Require a visitor Gemini key only for optional story generation; memory-only input and clear action.
- Remove environment key injection and AI Studio runtime imports; bundle existing styles and Markdown dependency.
- Sanitize generated/imported Markdown in both story views before rendering, because page scripts could otherwise read a visitor key.
- Validate missing-key and mocked provider transport/error behaviour, static build, typecheck and browser core/story paths. No paid provider calls or deployment.
# Validation

- Date: 2026-10-22. Agent: OpenAI Codex GPT-6-Astra in T3 Code.
- Node unit tests: 3 passed; TypeScript check passed; production Vite build passed without credentials.
- Missing-key rejection; visitor-key request; safe authentication errors. Browser: country and participation calculations without a key, mocked story, hostile Markdown sanitisation, clear, keyless saved story and JSON export, desktop/mobile.
- Isolated Playwright Chromium. All provider traffic mocked; external requests blocked. Synthetic keys only. Browser page errors: none. Screenshots checked.
- Runtime dependency audit at installation: zero known vulnerabilities. Tailwind 3 build tooling has 7 transitive advisories (5 high, 2 moderate); no forced major upgrade or style redesign performed. Vite warns about a bundle larger than 500 kB.
- Source prompts and existing model choices preserved. Model availability, live API/CORS behaviour and publication remain unverified.
- No public deployment, DNS change or Google Cloud shutdown. The output to publish later is `dist/`.

# Recovery

Branch: `feat/independent-own-key-web`. Re-run `npm ci`, `npm test`, `npm run typecheck`, `npm run build`. Browser evidence lives under `research/`; local automation scratch is ignored. Saved user data stays in its existing browser storage keys.
