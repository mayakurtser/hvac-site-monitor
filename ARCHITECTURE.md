# Architecture Decision Record

## Project Structure Rationale

```
src/
├── design-system/   # Portable UI kit — zero app/domain knowledge, props only
│   ├── primitives/  # Button, Badge, Card, Input, Select, Table, FeaturedIcon
│   └── MetricCard · EmptyState · Toolbar   # app-agnostic composed components
├── components/
│   ├── common/      # Domain/i18n-aware: StatusBadge, AlertFeed, DataTable, Pager, charts
│   └── layout/      # AppShell
├── pages/           # Route screens (DashboardPage, SiteDetailPage, AlertsPage)
├── store/           # Redux slices + typed hooks
├── hooks/           # Domain hooks that dispatch thunks
├── i18n/            # i18next setup + locales
├── mock/            # Static data + service wrappers (API seam)
├── types/           # Domain interfaces
├── utils/           # cn(), formatters
└── styles/          # Global tokens + dark mode
```

The design system is a **portable** layer: it imports no app code — no `@/store`, `@/hooks`, `@/types`, or app i18n, only props and the generic `cn()` helper — so it stays independently testable and extractable as a standalone package. Components that need domain types or translations (StatusBadge, AlertFeed, DataTable, Pager, charts) live one layer up in `src/components/common/`, which composes the design system but never the reverse. Route screens in `src/pages/` compose both. The dependency direction is strictly one-way: `pages → components/common → design-system`.

## State Management: Redux Toolkit

RTK was chosen over React Context because:
- `searchQuery` and `statusFilter` must survive page navigation (Context resets on unmount)
- Devtools are invaluable for debugging loading/error state transitions
- `createAsyncThunk` eliminates boilerplate for the loading→success→error lifecycle
- Typed `useAppSelector`/`useAppDispatch` hooks (in `src/store/hooks.ts`) prevent accidental use of the untyped versions

## CSS Architecture

Every component consumes `var(--*)` tokens exclusively — no hardcoded hex values anywhere. This single rule enables full dark mode via a 30-line `[data-theme="dark"]` block in `dark.css`.

Variant classes use camelCase to match CSS Modules' class name convention: `styles.secondaryGray`, not `styles['secondary-gray']`.

## Table: TanStack + CSS Module shell

TanStack Table v8 owns sorting/pagination logic; our `Table` primitives own every pixel. This is the same pattern as shadcn/ui — the library is headless, the design system is the UI. The `DataTable` component (`src/components/common/DataTable`) wires them together and is the only place `useReactTable` is instantiated; the per-page column factories (`useSiteColumns`, `useAlertColumns`) only declare `ColumnDef`s.

## Coding Standards

- Named exports only (no default exports).
- Consumers import from the barrels: `import { Badge } from '@/design-system'` and `import { DataTable } from '@/components/common'`. Inside the design system, siblings use the `@/design-system/...` alias deep path — never the `@/design-system` barrel (it re-exports them → circular import).
- Comments only for non-obvious WHY (hidden constraints, workarounds) — not for WHAT

## Testing Strategy

Unit tests cover design system primitives (Badge, Button) plus an i18n smoke test (`src/i18n/__tests__`). The seam for integration tests is `src/mock/services/siteService.ts` — swap it for a real HTTP client without touching any component.

For 4 developers: PRs require tests for any new primitive. Snapshots are discouraged (fragile). Prefer `getByRole` over `getByTestId`.

## Routing

`HashRouter` — routes live in the URL fragment, so deep links work on static hosts (GitHub Pages) without server-side rewrites.

## CI/CD

Deployment runs on **GitHub Pages** via `.github/workflows/deploy.yml`: every push to `main` builds and publishes `dist/`. Requires **Settings → Pages → Source: "GitHub Actions."** Vite's `base` is `/hvac-site-monitor/` for production builds (the project subpath).

Recommended for a team setting:

1. `npm run lint && npm run build` on every PR (catches type errors + ESLint)
2. `npm test` on every PR
