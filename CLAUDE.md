# HVAC Site Monitor — Claude Code Guidelines

## Commands

- `npm run dev` — Vite dev server (http://localhost:3000).
- `npm run build` — type-check + production build (`tsc -b && vite build`).
- `npm run lint` — ESLint; must be **0 errors**.
- `npm test` — Vitest (watch). Use `npx vitest run` for a single pass / CI.
- Before committing: build + lint clean, and tests green.

## Project structure

- `src/pages/` — route screens (one folder per route; `*Page.tsx` plus co-located helpers like `columns.tsx`).
- `src/components/common/` — shared app-aware components; `src/components/layout/` — the app shell.
- `src/design-system/` — portable UI kit (`primitives/` plus `MetricCard`/`EmptyState`/`Toolbar`).
- `src/store/` (Redux), `src/hooks/` (domain hooks), `src/i18n/`, `src/types/`, `src/utils/`, `src/mock/` (data + service seam), `src/styles/` (tokens).
- See `ARCHITECTURE.md` for the full tree and the rationale.

## Styling

- **No inline styles.** Every visual rule goes in a `.module.css` file. Only exception: dynamic values computed at runtime (e.g. SVG chart x/y coordinates).
- **No hardcoded hex values.** All colors, shadows, radii, and spacing must use `var(--*)` tokens defined in `src/styles/tokens.css`.
- **Charts (Highcharts).** Style charts inline in JS options (allowed exception; styled mode not required), but resolve colors from `var(--*)` tokens at runtime via `useChartTheme` (`src/components/common/charts/useChartTheme.ts`) — never hardcode hex — so theming keeps working.
- Use `cn()` from `src/utils/cn.ts` for conditional class names — never string concatenation.
- CSS class names in modules use **camelCase** (`styles.secondaryGray`, not `styles['secondary-gray']`).

## Components

- The `@/` alias maps to `src/` (configured in `tsconfig.json` + `vite.config.ts`).
- **Named exports only** — no default exports.
- **Consumers** (code outside `src/design-system/`) import from the barrel: `import { Button, Badge } from '@/design-system'` — never deep-import.
- **Inside `src/design-system/`**, import siblings via the `@/` alias deep path (`import { Card } from '@/design-system/primitives/Card'`) — never relative `../` paths, and never the `@/design-system` barrel (it re-exports these modules → circular import).

## File & folder naming

- **Components** — each is its own `PascalCase` folder matching the exported component, holding the `.tsx`, its mirrored `.module.css`, and an `index.ts` barrel that re-exports it (`MetricCard/MetricCard.tsx` + `MetricCard.module.css` + `index.ts`).
- **Grouping folders** (features, routes, categories) — `kebab-case`, lowercase when one word: `site-detail/`, `design-system/`, `pages/`, `primitives/`, `charts/`. Never `camelCase` for a folder.
- **Non-component modules** (hooks, utils, slices, services) — `camelCase`: `useSiteDetail.ts`, `siteDetailSlice.ts`, `cn.ts`. Hooks start with `use`.
- Casing signals the kind of thing — a path shows at a glance whether it's a component, a grouping, or a module. Never distinguish names by case alone (Linux CI is case-sensitive).

## State

- Always use `useAppDispatch` and `useAppSelector` from `src/store/hooks.ts` — never the raw `useDispatch`/`useSelector` from react-redux.
- Never store display text in Redux — store a stable code and translate at render.

## Internationalization (i18n)

- **No hardcoded user-facing strings.** Every label, placeholder, `aria-label`, empty state, and error message goes through `t()` from `useTranslation()` (`react-i18next`).
- Copy lives in `src/i18n/locales/<lang>.json`; English (`en`) is the base/fallback. Keys are grouped by area and **camelCase** (`dashboard.searchPlaceholder`).
- Plurals use i18next count rules (`key_one`/`key_other` with `{{count}}`). For other interpolation use **named** placeholders (`{{from}}`, `{{value}}`) — not `count`, which triggers plural lookup.
- TanStack columns can't call hooks at module scope — expose them as a factory hook (`useSiteColumns()`), never a module-level array.
- Design-system components stay free of i18n and receive translated strings as props (so the system stays portable); app-level `components/common` components **may** use the `react-i18next` hook.
- Don't translate mock data or the brand name.
- Add a locale: create `src/i18n/locales/<lang>.json` and register it in `src/i18n/index.ts`.

## Code style

- **Function declarations** for components, hooks, and module-level helpers (`function Foo() {}`, not `const Foo = () => {}`) — for hoisting and named stack traces. Use arrow functions for inline callbacks and the occasional typed wrapper (e.g. the typed Redux hooks in `src/store/hooks.ts`).
- No comments unless the **why** is non-obvious (a hidden constraint, a workaround for a specific bug). Never comment what the code does.
- No speculative abstractions — implement exactly what is needed.
- No `any` types. Use `unknown` + type narrowing if the shape is genuinely unknown.
- Domain types are `interface`s in `src/types`; use `import type` for type-only imports.
- **Import React hooks by name** (`import { useState } from 'react'`), never as `React.useState`.
- **Keep ternaries out of JSX where they stack.** For multi-state markup (loading / empty / data) use guard-style early returns or a local `renderX()` helper, not a nested/chained `?:`. A single short inline ternary — a className or value toggle — is fine.
- **Use `cond && <El/>` for an optional element** (not `cond ? <El/> : undefined`), and make `cond` an explicit boolean — coerce strings/booleans with `!!x`, compare numbers/objects (`items.length > 0`, `value != null`). Enforced by `react/jsx-no-leaked-render`, which stops a falsy `0`/`''` from leaking into the DOM.

## Testing

- Co-locate tests in a `__tests__/` folder next to the code (`Button/__tests__/Button.test.tsx`).
- Vitest + React Testing Library (jsdom). Prefer `getByRole` over `getByTestId`; no snapshot tests.
- Cover new design-system primitives. Run a single pass with `npx vitest run`.
- See `ARCHITECTURE.md` (Testing Strategy) for the `siteService` seam used in integration tests.

## Git workflow

- **Never push directly to `main`.** Create a feature branch first, before your first commit.
- Branch naming: `feat/<short-description>`, `fix/<short-description>`, or `chore/<short-description>`.
- Example: `git checkout -b feat/alert-filters && git push -u origin feat/alert-filters`
- Write commit messages that explain the **why**, not the what.

## Design system boundaries

- The design system (`src/design-system/`) is **portable** — it must not import app code: no `@/store`, `@/hooks`, `@/types`, app i18n keys, or app constants. Keep it extractable as a standalone package.
- It holds `primitives/` (pure controls) plus a few app-agnostic composed components at the top level (`MetricCard`, `EmptyState`, `Toolbar`). Every component has a `.module.css` sibling and an `index.ts` barrel export.
- **Domain / app-aware components** — anything needing `@/types`, app i18n keys, etc. — live in `src/components/common/` (e.g. `StatusBadge`, `AlertFeed`, `charts/*`, `DataTable`, `Pager`) and are imported from `@/components/common`. They may compose design-system components (via the `@/design-system` barrel) — never the reverse.
