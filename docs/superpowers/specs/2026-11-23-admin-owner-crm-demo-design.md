# Admin + Owner CRM demo shell — design

## Intent

Turn `/admin` and `/proprietar` into a cohesive, modern CRM-style management demo so someone can click through and *feel* how Mingo would work for operators and pitch owners — without a real backend.

## Why

Today both areas are thin demo shells: raw tables, bare count cards, almost no pagination/filters/charts/motion. For a product walkthrough that reads as a serious SaaS ops console, the management surfaces need shared CRM primitives and richer page composition on the existing mock data.

## Goals

- Shared CRM UI kit reused by admin and owner: KPI cards (with optional delta/trend hint), data table shell, search/filter toolbar, reusable pagination, simple charts (bars + spark/line-style series), list entrance / hover motion that respects `prefers-reduced-motion`.
- **Pagination on every list page** in admin and owner (query-param based, same mental model as public `/terenuri`).
- Admin panou: KPI row + at least one chart (e.g. bookings by status or by day) + recent activity / short table.
- Admin list pages (membri/utilizatori, terenuri, rezervări): toolbar + paginated table + empty/filter-empty states; keep suspend/reactivate demo on membri.
- Collapse the redundant admin routes: **one** people surface (keep `/admin/membri` as the CRM users page; `/admin/utilizatori` redirects or becomes an alias — builder call below).
- Owner panou: richer KPIs + chart + upcoming bookings strip / recent activity.
- Owner: paginated terenuri list; new **Rezervări** management page (list + status filter + demo confirm/cancel in local state); upgrade statistici to real chart composition; calendar keeps working but gains clearer chrome and pagination/window controls if the list overflow needs it.
- Expand mock fixtures enough that pagination and charts are visibly useful in a demo (more bookings/users/slots derived from existing generators is fine).
- Romanian copy; forest / ivory / coral tokens; stay within the existing `DashboardShell` + `PageShell` chrome (improve shell polish, don’t invent a second layout system).
- Demo-only mutations stay in React state (or equivalent client store); no API routes, no DB, no real auth.

## Non-goals

- Real authentication, middleware guards, or ownership enforcement beyond the current demo session.
- Real billing, invoices, payouts, or live subscription state.
- New product domains that aren’t needed for the walkthrough (team/staff accounts, notifications center, audit log, exports CSV, bulk multi-select ops).
- Rewriting the public player booking funnel or marketing landing pages.
- Installing a heavy charting/animation stack unless a thin dependency is clearly cheaper than CSS/SVG — prefer zero or one small dependency; builder decides with ponytail bias toward no new deps if CSS/SVG charts + existing motion tokens suffice.

## Anti-goals

- Pretty skins on the same sparse tables with no pagination/filters/KPIs (still doesn’t demo “CRM”).
- Cards-everywhere dashboard clutter that fights the existing Mingo visual language.
- Purple/glow “AI dashboard” aesthetics or a second unrelated theme.
- Fake backend complexity that breaks the demo when offline or when fixtures change shape.
- Shipping without tests for new production lines (project rule: test-every-line).

## Constraints

- Next.js app as in repo (`src/app/...`); mock layer in `src/lib/mock/*`.
- Theme from `src/config/theme.ts` / `src/styles/tokens.css`.
- Existing components to generalize rather than duplicate: `PitchPagination` (needs `basePath`), filter patterns from public pitches/bookings, `StatusBadge`, `EmptyState` / `TableSkeleton`, `Dialog`.
- Skills for implementation phase (after this design is approved + plan written): writing-plans → using-git-worktrees → TDD / test-every-line / ponytail / verification; UI: impeccable + emil-design-eng + web-design-guidelines (accessibility floor). design-taste-frontend applies where marketing-like surfaces appear (e.g. abonamente), not as a landing-page rewrite of the CRM.
- Romanian UI strings.

## Approaches

1. **CRM-shell on mock (chosen)** — shared primitives + richer admin/owner pages + local demo actions + fixture growth. Best for a walkthrough: looks operational, stays demo-safe.
2. Visual polish only on current pages — faster, but still reads as sparse tables, weak for “show how it works.”
3. Full mock CRM (customers, revenue ledger, notifications, bulk ops) — too much surface for this demo; many empty or shallow screens.

## Design

### Shared CRM kit (`src/components/crm/` or equivalent)

| Primitive | Role |
|-----------|------|
| `KpiCard` | Label, value, optional delta/hint, optional link |
| `CrmToolbar` | Search input + filter slots + result count |
| `DataTable` | Accessible table wrapper (header, rows, empty slot); pages supply columns |
| `CrmPagination` | Generalized from `PitchPagination` with `basePath` + page/total |
| `TrendChart` / `BarChart` | SVG or CSS charts for status/time series; theme colors |
| `ActivityList` | Compact recent rows for panouri |
| Motion helpers | CSS classes / small wrappers for staggered row enter + press; honor reduced motion |

No second design system: reuse `Button`, `Input`, `StatusBadge`, `Dialog`, tokens.

### Data / queries

- Add platform-level aggregations for admin (counts, bookings-by-status, simple day series) next to existing `ownerBookingStats`.
- Generalize list paging helpers (e.g. `paginate(items, page, pageSize)`) used by admin users/pitches/bookings and owner pitches/bookings.
- Grow fixtures (bookings/users) so multiple pages and chart shapes are obvious in a live click-through.
- Owner identity remains demo `"u-owner"` unless an existing helper already abstracts it — builder may extract a constant.

### Admin information architecture

| Route | Behavior |
|-------|----------|
| `/admin` | KPI row, one chart, recent rezervări / activity, quick links |
| `/admin/membri` | CRM users: search + role/status filters, paginated table, suspend/reactivate demo |
| `/admin/utilizatori` | Redirect to `/admin/membri` (or remove from nav and soft-redirect) — **builder call: prefer redirect + drop nav link** |
| `/admin/terenuri` | Search/filter + paginated table; richer columns from `Pitch` |
| `/admin/rezervari` | Status filter + paginated table; deep link to public detail OK for demo |

Sidebar: drop duplicate Utilizatori once membri owns people.

### Owner information architecture

| Route | Behavior |
|-------|----------|
| `/proprietar` | KPIs + chart + upcoming/recent bookings + CTAs |
| `/proprietar/terenuri` | Paginated list/table (not only a flat short `<ul>`) |
| `/proprietar/rezervari` | **New** — owner bookings list, status filter, pagination, demo confirm/cancel |
| `/proprietar/statistici` | KPI + bar/trend charts from `ownerBookingStats` (+ series if added) |
| `/proprietar/calendar`, `disponibilitate`, `terenuri/nou`, `[id]`, `abonamente` | Keep; upgrade chrome/empty states where cheap; abonamente can reuse public plans UI if already shared — no billing |

Add **Rezervări** to `DashboardShell` owner links.

### Demo interactions

- Membri: suspend/reactivate (already local state) — keep, restyle into CRM row actions.
- Owner rezervări: confirm / cancel toggles in local state with toast-or-inline confirmation via existing `Dialog`.
- No persistence across refresh (acceptable for demo); optional `sessionStorage` is **not required**.

### Motion & polish

- Staggered appearance for KPI row and table rows on first paint.
- Hover/press on KPI and row affordances using existing `--motion-press-ms` / `--ease-out`.
- Charts animate width/stroke once on enter when motion is allowed.
- Dashboard shell: subtle active indicator polish; optional badge counts on nav items if cheap from mocks — not required for v1.

### Testing

- Unit/component tests for each new CRM primitive and for paging/filter helpers.
- Page-level tests for admin panou KPIs, membri pagination/filter, owner rezervări demo actions, statistici chart presence.
- Every new production line covered (project rule).

## Left to builder

- Exact chart SVG vs pure CSS implementation and whether any dependency is justified.
- Page size default (suggest 5–8 rows so pagination shows with expanded fixtures).
- Whether `/admin/utilizatori` is a Next redirect or a thin re-export page.
- Precise column sets and Romanian microcopy.
- How much calendar/disponibilitate restyle is in-scope beyond “chrome consistency” (default: light touch unless time remains).
- Extracting `"u-owner"` to a named demo constant.
- Optional nav badge counts.
