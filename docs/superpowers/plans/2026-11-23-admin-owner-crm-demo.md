# Admin + Owner CRM Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/admin` and `/proprietar` into a cohesive CRM-style demo (KPI cards, charts, toolbars, paginated tables, motion) on expanded mock data so a walkthrough feels like a real ops console.

**Architecture:** Shared CRM primitives under `src/components/crm/` consume new mock query helpers (`paginate`, platform/owner aggregations, list filters). Admin and owner pages compose those primitives; demo mutations stay in client state. No new chart/motion npm deps — SVG + existing CSS motion tokens.

**Tech Stack:** Next.js App Router, React 19, Vitest + Testing Library, existing theme tokens / `PageShell` / `DashboardShell` / `Dialog` / `StatusBadge`.

**Spec:** `docs/superpowers/specs/2026-11-23-admin-owner-crm-demo-design.md`

## Global Constraints

- Romanian copy; forest / ivory / coral theme only (`src/config/theme.ts`).
- Demo only — no API routes, DB, real auth, or billing.
- Default list page size: `CRM_PAGE_SIZE = 5` (pagination must show with expanded fixtures).
- Charts/motion: CSS/SVG only; honor `prefers-reduced-motion`.
- Tests execute every new production line (`test-every-line`); TDD order (failing test → code → pass).
- Do **not** create git commits unless the user explicitly asks.
- Follow Next.js docs under `node_modules/next/dist/docs/` if App Router APIs are unclear.
- Read and follow `.agents/skills/ponytail/SKILL.md`, `test-driven-development`, `test-every-line`, `verification-before-completion`, plus UI skills `impeccable`, `emil-design-eng`, `web-design-guidelines` when touching CRM UI.

## Review Focus

- Invalid / out-of-range `page` query → clamp to a valid page (same behavior as `queryPitchesPage`); never empty wrong page.
- Filter + page together → changing filters resets to page 1 via links that omit `page` or set `page=1`.
- Empty filter results → `EmptyState` (or DataTable empty slot), not a blank table body.
- `/admin/utilizatori` → redirects to `/admin/membri`; Utilizatori removed from admin nav.
- Owner rezervări confirm/cancel → only that row’s status changes in local state; other rows unchanged.

---

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/mock/demo.ts` | `DEMO_OWNER_ID = "u-owner"` |
| `src/lib/mock/paginate.ts` | Generic `paginate` + `CRM_PAGE_SIZE` |
| `src/lib/mock/crm-queries.ts` | Admin/owner list filters, platform stats, booking series, owner bookings |
| `src/lib/mock/fixtures.ts` | Grow users + bookings (+ slots as needed) |
| `src/components/crm/crm-pagination.tsx` | `basePath` pagination |
| `src/components/pitches/pitch-pagination.tsx` | Thin wrapper → `CrmPagination` `basePath="/terenuri"` |
| `src/components/crm/kpi-card.tsx` | KPI tile |
| `src/components/crm/bar-chart.tsx` | Horizontal/vertical bar chart SVG |
| `src/components/crm/trend-chart.tsx` | Simple SVG polyline series |
| `src/components/crm/crm-toolbar.tsx` | Search + filter slot + count |
| `src/components/crm/data-table.tsx` | Accessible table shell |
| `src/components/crm/activity-list.tsx` | Compact recent rows |
| `src/components/crm/crm-motion.ts` | Enter animation class helpers |
| `src/components/layout/dashboard-shell.tsx` | Nav: drop Utilizatori; add owner Rezervări |
| `src/app/admin/page.tsx` | Admin CRM panou |
| `src/app/admin/membri/page.tsx` | Users CRM + suspend demo |
| `src/app/admin/utilizatori/page.tsx` | Redirect to membri |
| `src/app/admin/terenuri/page.tsx` | Paginated pitches |
| `src/app/admin/rezervari/page.tsx` | Paginated bookings |
| `src/app/proprietar/page.tsx` | Owner CRM panou |
| `src/app/proprietar/terenuri/page.tsx` | Paginated owner pitches |
| `src/app/proprietar/rezervari/page.tsx` | New owner bookings CRM |
| `src/app/proprietar/statistici/page.tsx` | KPI + charts |

---

### Task 1: Mock helpers + fixture growth

**Files:**
- Create: `src/lib/mock/demo.ts`
- Create: `src/lib/mock/paginate.ts`
- Create: `src/lib/mock/crm-queries.ts`
- Modify: `src/lib/mock/fixtures.ts`
- Test: `src/lib/mock/paginate.test.ts`, `src/lib/mock/crm-queries.test.ts`

**Interfaces:**
- Consumes: `User`, `Pitch`, `Booking`, `BookingStatus` from `types`; fixtures; existing `getSlot`, `ownerPitches`, `bookingsSortedByStartsAt`
- Produces:
  - `export const DEMO_OWNER_ID = "u-owner"`
  - `export const CRM_PAGE_SIZE = 5`
  - `export type PageResult<T> = { items: T[]; page: number; pageSize: number; total: number; totalPages: number }`
  - `export function paginate<T>(items: T[], pageParam: string | undefined, pageSize?: number): PageResult<T>`
  - `export function adminPlatformStats(): { users: number; pitches: number; bookings: number; byStatus: { status: BookingStatus; count: number }[]; series: { label: string; value: number }[] }`
  - `export function filterUsers(list: User[], filters: { q?: string; role?: string; status?: string }): User[]`
  - `export function filterBookings(list: Booking[], filters: { q?: string; status?: string }): Booking[]` — `q` matches pitch name via `getPitch`
  - `export function filterAdminPitches(list: Pitch[], filters: { q?: string }): Pitch[]`
  - `export function ownerBookings(ownerId: string): Booking[]`
  - `export function queryOwnerBookingsPage(ownerId: string, filters: { q?: string; status?: string; page?: string }): PageResult<Booking>`
  - Fixtures: ≥12 users and ≥16 bookings (with slots) so `CRM_PAGE_SIZE=5` yields ≥2 pages on unfiltered admin lists

- [ ] **Step 1: Write failing tests** in `paginate.test.ts` and `crm-queries.test.ts`

```ts
// paginate.test.ts — assert pageSize 5 default, clamps page "999" to last, page "0"/NaN → 1, empty list totalPages 0
// crm-queries.test.ts — adminPlatformStats sums match fixture lengths; byStatus covers all statuses present;
// series length ≥ 1; filterUsers by role/status/q; ownerBookings only DEMO_OWNER_ID pitches;
// queryOwnerBookingsPage page 2 has items when total > 5
```

- [ ] **Step 2: Run tests — expect FAIL** (modules missing)

Run: `npm test -- src/lib/mock/paginate.test.ts src/lib/mock/crm-queries.test.ts`

- [ ] **Step 3: Implement modules + grow fixtures**

`paginate` mirrors `queryPitchesPage` clamp logic. `adminPlatformStats.series`: count bookings per calendar day of slot `startsAt` (sorted ascending, label `ro-RO` short date). Grow fixtures without breaking existing public tests — keep existing ids; append new ones.

- [ ] **Step 4: Run tests — expect PASS**

Run: `npm test -- src/lib/mock/paginate.test.ts src/lib/mock/crm-queries.test.ts`

---

### Task 2: CrmPagination (+ PitchPagination wrapper)

**Files:**
- Create: `src/components/crm/crm-pagination.tsx`
- Modify: `src/components/pitches/pitch-pagination.tsx`
- Test: `src/components/crm/crm-pagination.test.tsx`

**Interfaces:**
- Consumes: `theme`
- Produces:
  - `export function CrmPagination(props: { basePath: string; page: number; totalPages: number; filters: Record<string, string | undefined>; ariaLabel?: string }): ReactNode`
  - Href builder: preserve filters except `page`; omit `page` when `page === 1`; `basePath` + `?query`
  - Hidden when `totalPages <= 1`
  - `PitchPagination` delegates to `CrmPagination` with `basePath="/terenuri"` and `ariaLabel="Paginare terenuri"`

- [ ] **Step 1: Write failing test** — renders links under `/admin/rezervari`, keeps `status=open`, page 2 href includes `page=2`, page 1 omits `page`; hidden when `totalPages={1}`

- [ ] **Step 2: Run — expect FAIL**

Run: `npm test -- src/components/crm/crm-pagination.test.tsx`

- [ ] **Step 3: Implement `CrmPagination`; refactor `PitchPagination`**

- [ ] **Step 4: Run — expect PASS** (+ existing pitch pagination tests if any)

Run: `npm test -- src/components/crm/crm-pagination.test.tsx`

---

### Task 3: KpiCard + crm motion helper

**Files:**
- Create: `src/components/crm/crm-motion.ts`
- Create: `src/components/crm/kpi-card.tsx`
- Test: `src/components/crm/kpi-card.test.tsx`

**Interfaces:**
- Consumes: `theme`, `Link` optional
- Produces:
  - `export const crmEnterClass = "crm-enter"` (string used as className; CSS in `globals.css` or co-located — fade/translate on `@keyframes`; `@media (prefers-reduced-motion: reduce)` disables)
  - `export function KpiCard(props: { label: string; value: string | number; hint?: string; href?: string; index?: number }): ReactNode`
  - When `href` set, card is a link; otherwise a `div`. Uses `crmEnterClass` + optional `style={{ animationDelay: `${(index??0)*40}ms` }}`

- [ ] **Step 1: Write failing test** — shows label/value/hint; with `href` renders link to that path

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement + minimal CSS for `.crm-enter`**

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- src/components/crm/kpi-card.test.tsx`

---

### Task 4: BarChart + TrendChart

**Files:**
- Create: `src/components/crm/bar-chart.tsx`
- Create: `src/components/crm/trend-chart.tsx`
- Test: `src/components/crm/bar-chart.test.tsx`, `src/components/crm/trend-chart.test.tsx`

**Interfaces:**
- Consumes: `theme`
- Produces:
  - `export type ChartDatum = { label: string; value: number }`
  - `export function BarChart(props: { data: ChartDatum[]; title: string }): ReactNode` — accessible `role="img"` + `aria-label={title}`; one bar per datum; empty data → short empty message
  - `export function TrendChart(props: { data: ChartDatum[]; title: string }): ReactNode` — SVG polyline; empty → empty message

- [ ] **Step 1: Write failing tests** — bar renders title + N bars for N data; trend renders polyline points; empty data shows Romanian empty copy e.g. `Nu există date`

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement SVG charts (no new deps)**

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- src/components/crm/bar-chart.test.tsx src/components/crm/trend-chart.test.tsx`

---

### Task 5: CrmToolbar + DataTable + ActivityList

**Files:**
- Create: `src/components/crm/crm-toolbar.tsx`
- Create: `src/components/crm/data-table.tsx`
- Create: `src/components/crm/activity-list.tsx`
- Test: `src/components/crm/crm-toolbar.test.tsx`, `src/components/crm/data-table.test.tsx`, `src/components/crm/activity-list.test.tsx`

**Interfaces:**
- Consumes: `Input` (or native input), `EmptyState` optional
- Produces:
  - `CrmToolbar({ resultCount: number; searchName?: string; searchDefault?: string; children?: ReactNode })` — GET form optional fields left to builder; must show count text including the number; search input `name={searchName??"q"}` when search enabled
  - `DataTable({ columns: string[]; children: ReactNode; empty?: ReactNode })` — `<table>` with `<thead>` from columns; if `children` null/empty and `empty` provided, render `empty` instead of tbody rows
  - `ActivityList({ items: { id: string; title: string; meta: string; href?: string }[] })` — list; empty → `Nu există activitate recentă`

- [ ] **Step 1: Write failing tests** for count text, column headers, empty slot, activity titles/empty

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement three components**

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- src/components/crm/crm-toolbar.test.tsx src/components/crm/data-table.test.tsx src/components/crm/activity-list.test.tsx`

---

### Task 6: DashboardShell nav IA

**Files:**
- Modify: `src/components/layout/dashboard-shell.tsx`
- Test: `src/components/layout/dashboard-shell.test.tsx` (create if missing)

**Interfaces:**
- Consumes: existing shell
- Produces: admin links without Utilizatori; owner links include `{ href: "/proprietar/rezervari", label: "Rezervări" }` (place after Terenuri)

- [ ] **Step 1: Write failing test** — admin mode: no link to `/admin/utilizatori`; has membri/terenuri/rezervari. Owner mode: has `/proprietar/rezervari`

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Update `adminLinks` / `ownerLinks`**

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- src/components/layout/dashboard-shell.test.tsx`

---

### Task 7: Admin panou CRM

**Files:**
- Modify: `src/app/admin/page.tsx`
- Test: `src/app/admin/admin-panou.test.tsx`

**Interfaces:**
- Consumes: `KpiCard`, `BarChart` or `TrendChart`, `ActivityList`, `adminPlatformStats`, `bookingsSortedByStartsAt`, `formatDateTime`, `getPitch`

- [ ] **Step 1: Write failing test** — renders KPI labels `Membri`, `Terenuri`, `Rezervări` with counts from fixtures; chart title present; activity list shows at least one booking title

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Rebuild page** — 3+ KPIs linking to list routes; status `BarChart` from `byStatus`; `TrendChart` from `series` (or one chart if space); recent 5 bookings via `ActivityList`

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- src/app/admin/admin-panou.test.tsx`

---

### Task 8: Admin membri CRM + utilizatori redirect

**Files:**
- Modify: `src/app/admin/membri/page.tsx`
- Modify: `src/app/admin/utilizatori/page.tsx`
- Test: `src/app/admin/membri/admin-membri.test.tsx`, `src/app/admin/utilizatori/admin-utilizatori-redirect.test.tsx`

**Interfaces:**
- Consumes: `filterUsers`, `paginate`, `CrmToolbar`, `DataTable`, `CrmPagination`, `Dialog`, `useSearchParams`
- Produces: client page; filters `q`/`role`/`status` from URL; paginate filtered local `rows`; suspend/reactivate updates that user only; `utilizatori/page.tsx` uses `redirect("/admin/membri")` from `next/navigation`

- [ ] **Step 1: Write failing tests** — membri shows search; with `?role=owner` only owners; pagination nav when enough users; suspend flips status in DOM after confirm. Utilizatori test: module calls redirect to `/admin/membri` (mock `redirect` or assert exported behavior per existing Next test patterns in repo)

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement membri CRM + redirect page**

Pin Review Focus: out-of-range page clamps; empty filter → empty state.

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- src/app/admin/membri/admin-membri.test.tsx src/app/admin/utilizatori/admin-utilizatori-redirect.test.tsx`

---

### Task 9: Admin terenuri + rezervări lists

**Files:**
- Modify: `src/app/admin/terenuri/page.tsx`
- Modify: `src/app/admin/rezervari/page.tsx`
- Test: `src/app/admin/terenuri/admin-terenuri.test.tsx`, update/extend `src/app/admin/rezervari/admin-rezervari.test.tsx`

**Interfaces:**
- Consumes: `filterAdminPitches` / `filterBookings`, `paginate`, CRM components, `StatusBadge`, `searchParams` (server components preferred)

- [ ] **Step 1: Write failing tests** — terenuri: toolbar + page size ≤5 rows on page 1 + pagination when total>5. Rezervări: `?status=cancelled` filters; pagination present; `StatusBadge` still used

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement both server pages** with `CrmPagination` `basePath` `/admin/terenuri` and `/admin/rezervari`

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- src/app/admin/terenuri/admin-terenuri.test.tsx src/app/admin/rezervari/admin-rezervari.test.tsx`

---

### Task 10: Owner panou + terenuri pagination

**Files:**
- Modify: `src/app/proprietar/page.tsx`
- Modify: `src/app/proprietar/terenuri/page.tsx`
- Test: `src/app/proprietar/owner-panou.test.tsx`, extend `src/app/proprietar/terenuri/owner-terenuri-feedback.test.tsx` or add `owner-terenuri-list.test.tsx`

**Interfaces:**
- Consumes: `DEMO_OWNER_ID`, `ownerBookingStats`, `ownerPitches`, `ownerBookings`, CRM KPIs/charts/activity, `paginate`

- [ ] **Step 1: Write failing tests** — panou KPIs + chart + upcoming/recent activity. Terenuri: ≤5 items page 1 when owner has >5 pitches **or** if fixtures keep ≤5 owner pitches, still render `CrmPagination` hidden and toolbar/table shell; grow owner pitches in Task 1 if needed so pagination shows (pin: ensure `ownerPitches(DEMO_OWNER_ID).length > CRM_PAGE_SIZE` in fixtures)

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement both pages**

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- src/app/proprietar/owner-panou.test.tsx src/app/proprietar/terenuri/owner-terenuri-list.test.tsx`

---

### Task 11: Owner rezervări page (demo actions)

**Files:**
- Create: `src/app/proprietar/rezervari/page.tsx`
- Test: `src/app/proprietar/rezervari/owner-rezervari.test.tsx`

**Interfaces:**
- Consumes: `ownerBookings`, `filterBookings`, `paginate`, CRM table/toolbar/pagination, `Dialog`, `StatusBadge`, `DEMO_OWNER_ID`
- Produces: client page; confirm sets status `confirmed`; cancel sets `cancelled`; only target row changes (Review Focus)

- [ ] **Step 1: Write failing test** — lists owner bookings; filter `status`; confirm action updates badge text for that booking only

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement page**

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- src/app/proprietar/rezervari/owner-rezervari.test.tsx`

---

### Task 12: Owner statistici charts + verification sweep

**Files:**
- Modify: `src/app/proprietar/statistici/page.tsx`
- Test: `src/app/proprietar/statistici/owner-statistici.test.tsx`

**Interfaces:**
- Consumes: `KpiCard`, `BarChart` (byPitch), `TrendChart` optional from owner-filtered series helper — if missing, add `ownerBookingSeries(ownerId)` in `crm-queries.ts` in this task with a unit test

- [ ] **Step 1: Write failing test** — KPIs + chart title `Rezervări pe teren` (or equivalent) present

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Rebuild statistici with shared CRM charts/KPIs**

- [ ] **Step 4: Full verification**

Run: `npm test`  
Expected: all tests PASS

Also run: `npm run lint` if cheap; fix any new issues in touched files.

---

## Self-review notes (author)

- Spec coverage: shared kit (T2–T5), pagination everywhere (T2, T8–T11), admin/owner panouri (T7, T10), membri + redirect (T8), owner rezervări (T11), statistici (T12), fixtures (T1), shell IA (T6), motion (T3), no backend (constraints).
- Light calendar/disponibilitate restyle left optional per spec — not a blocking task.
- Abonamente reuse of public plans — out of scope unless already done; not required here.
