# Boulders Classic 2026 — Tournament Mini-Site

Official tournament site for the **Boulders Classic 2026** (PGTI Tour, Boulder Hills Golf
Club, Hyderabad, April 14–17, 2026). React 19 + Vite + Tailwind, frontend-only: all
tournament data is hardcoded, no backend or database is required to run or deploy.

## Tournament data

All data lives in [`src/data/boulder-classic.ts`](src/data/boulder-classic.ts):

- Official final leaderboard — 53 finishers with round scores and per-hole scorecards
- Full 132-player field with PGTI codes, countries, ages, entry categories and cut status
- Official draws for all four rounds (tees 1 & 10)
- ₹1,00,00,000 purse on the PGTI prize ladder with pooled ties
- Hole-by-hole scorecards with official Boulder Hills pars (Par 72)

The module is generated from the tournament's extracted JSON source of truth:

```bash
node scripts/generate-boulder-data.mjs
```

Regenerating requires the source folder (`BOULDER_SOURCE_DIR` env var overrides the
default path). The generated file is committed, so the deployed site never touches a
backend, database, or the source folder.

Per-hole yardages are championship-tee approximations (not present in the source data);
every other figure is official tournament data.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build:web  # static build -> dist/public
npm run preview    # serve the production build
npm run check      # typecheck
```

## Deploy (Vercel)

The repo is Vercel-ready (`vercel.json`):

- Framework preset: **Vite** (auto-detected)
- Build command: `npm run build:web`
- Output directory: `dist/public`
- SPA rewrites: all routes fall back to `index.html` for React Router

Import the repo in Vercel (or run `npx vercel` from the project root) and deploy — no
environment variables required.

## Optional local backend

The `api/`, `db/` and `contracts/` folders contain the original Hono + tRPC + Drizzle
(MySQL) backend. The frontend no longer calls it — it is kept only for future full-stack
work and is excluded from the Vercel build (`build:web` skips it).
