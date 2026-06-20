# HVAC Site Monitor

A responsive web application for monitoring HVAC sites and their status. React + TypeScript, functional components and hooks throughout.

**Live demo:** https://mayakurtser.github.io/hvac-site-monitor/

## Quick Start

Requires Node 20+.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check (tsc -b) + production build
npm run lint     # ESLint — 0 errors expected
npx vitest run   # single test pass (npm test runs Vitest in watch mode)
```

No backend or environment variables are needed — all data is served from an in-memory mock layer.

## Features

- **Sites Dashboard** — searchable, filterable, sortable table of HVAC sites; fleet stat tiles; status overview bar.
- **Site Detail** — unit-summary donut chart, 24-hour temperature trend, recent-alerts table.
- **Design System** — portable component library with zero domain knowledge, barrel-exported from `@/design-system`.
- **Dark Mode** — a root-level `data-theme` attribute swaps the `var(--*)` tokens, re-theming everything (charts included) with no per-component dark styles. Persisted to `localStorage` for the demo — in production it'd be an account setting, synced cross-device.
- **Persisted filter state** — the Sites dashboard and Alerts filters (search, status/severity, sort, page) persist to `localStorage`, surviving both in-app navigation and a full page refresh; global search instead lives in the URL (`/search?q=…`), so those result views stay shareable.
- **Internationalization** — all UI copy externalized to locale files via react-i18next (English base); add a language by dropping in a JSON file.
- **Loading & error states** — every async fetch goes through a `createAsyncThunk` lifecycle, so each screen renders explicit loading and error UI.

## Mobile support (beta)

> **Partial / beta.** The app is desktop-first. Mobile support is functional but
> still being refined — best experienced on a desktop browser.

Below **820px** the layout adapts for phones:

- The sidebar collapses into a compact **top bar** — brand, Sites/Alerts
  navigation, dark-mode toggle, and user avatar.
- Data tables drop low-priority columns to fit a narrow screen: **Sites** shows
  Site · Status · Avg Temp; **Alerts** shows Alert · Severity · Time. Sorting,
  filtering, and row navigation are preserved.
- The **Site Detail** page stacks its cards into a single column.

**Known limitations:** navigation lives in the top bar (no bottom tab bar yet),
the layout is tuned for the single 820px breakpoint, and wide tables hide
columns rather than reflowing into cards.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Vite + React 19 + React Router v7 |
| Language | TypeScript (strict) |
| Styling | CSS Modules + CSS custom-property design tokens |
| State | Redux Toolkit |
| Table logic | TanStack Table v8 (headless) |
| Charts | Highcharts (token-themed at runtime via `useChartTheme`, with the accessibility module) |
| Icons | lucide-react |
| i18n | i18next + react-i18next |
| Tests | Vitest + React Testing Library (jsdom) |

## Assumptions Made

- **No real backend.** Data comes from an in-memory dataset (`src/mock/data/`) served through an async service layer (`src/mock/services/`) that simulates network latency. This service layer is the seam where a real REST/GraphQL client would slot in without touching any UI code.
- **Status is a fixed five-value enum** — `online`, `warning`, `critical`, `maintenance`, `offline`. "Needs attention" aggregates warning + critical + offline.
- **Active alert count** is the number of alerts attached to a site; alert severities are `critical` / `warning` / `info`.
- **Search matches site name *and* customer name** (case-insensitive substring). Site-name search is the baseline; customer is included as a natural operator expectation.
- **Sorting is single-column** (toggle asc/desc per header) across all dashboard columns. Multi-column sort adds UX complexity for little gain here, so it's deferred.
- **Pagination is handled in the mock service** (the API seam), not in the UI: `fetchSites` accepts `page`/`pageSize` and returns a single page plus a `total` count — exactly like a real paginated endpoint — so the UI never holds the full set and swapping in a real API needs no component change.
- **The mock dataset is generated once and cached to `localStorage`** (under `hvac.mock.dataset`, behind a `DATASET_VERSION` marker). Alert timestamps are anchored at generation time, so relative labels ("12 min ago") and the whole dataset stay stable across full page reloads — not just within a session. It's regenerated only when the cache is absent, invalid/corrupted, or `DATASET_VERSION` is bumped (required whenever the seed data or the `Site`/`SiteAlert` shape changes).
- **No authentication, multi-tenant scoping, or real-time updates** (websockets/polling) — out of scope for a read-only monitoring demo. A manual refresh button re-fetches on demand.
- **Mock customers, sites, and cities are illustrative**, not real.

## AI Tools Used

**Which tools.** Claude (Anthropic), used primarily through Claude Code (the agentic CLI).

**Design system.** The visual language wasn't invented here — it came from an existing design system provided as a **Figma file**. That Figma system was handed to Claude, which turned it into an implementation prompt; Claude Code then built it into this codebase, porting the design tokens into `src/styles/tokens.css` and the `src/design-system/` primitives to match.

**How they were used.** For scaffolding components and their CSS-module/token boilerplate, generating the representative mock dataset, drafting tests and i18n keys, and as a review/pair-programming partner during refactors. Work was iterative — the developer directed the architecture, prompted for specific changes, and reviewed every diff.

**Decisions influenced by AI.** Several structural choices were discussed with and partly suggested by Claude, then ratified by the developer:
- The **portable design-system boundary** (no app imports) and the one-way dependency rule `pages → components/common → design-system`.
- The **headless-table + CSS-module-shell** pattern (TanStack owns sorting/pagination logic; our primitives own every pixel — shadcn-style).
- The **service-seam** approach (`siteService`/`alertService`) that keeps the app mockable and swappable for a real client.
- **Tokens-only CSS** (no hardcoded hex), which is what makes dark mode a small `[data-theme="dark"]` override.

All submitted code can be explained and discussed.

## Architecture & Conventions

- **[`ARCHITECTURE.md`](./ARCHITECTURE.md)** — the structural decisions and their rationale: the project-structure layering, how the app scales, the state-management choice, and team practices (coding standards, PR process, testing strategy, CI/CD).
- **[`CLAUDE.md`](./CLAUDE.md)** — the coding conventions and standards (styling/tokens, component & file/folder naming, imports, state, i18n, and the design-system boundary). The single source of truth for *how we write code here*.

## Internationalization

All user-facing copy lives in `src/i18n/locales/` with English (`en`) as the base. To add a language, create `src/i18n/locales/<lang>.json` and register it in the `resources` map in `src/i18n/index.ts`. See `CLAUDE.md` for the full i18n conventions (key naming, plurals, the design-system boundary).

## Deployment

Deployed to **GitHub Pages** at https://mayakurtser.github.io/hvac-site-monitor/ via `.github/workflows/deploy.yml` on push to `main`. Enable once: **Settings → Pages → Source: "GitHub Actions."** Uses `HashRouter` so deep links work on a static host without server-side rewrites; Vite's `base` is `/hvac-site-monitor/` for production builds.
