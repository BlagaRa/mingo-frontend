# Owner UX cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Default-open pitch program with close exceptions, merge Calendar into Rezervări, clean owner nav, Abonament hub, filterable Statistici, unified Combobox chrome.

**Architecture:** Invert availability from opt-in slots to program window + closed exceptions (`program-store` driving `isStartOpen`). Owner pages share SelectField pitch pickers and ivory/forest PageShell. Calendar route redirects; rezervări owns month + create booking.

**Tech Stack:** Next.js App Router, React client pages, Vitest + Testing Library, existing SelectField/Combobox, theme tokens.

**Spec:** `docs/superpowers/specs/2026-11-23-owner-ux-cleanup-design.md`

## Global Constraints

- Romanian UI copy only; no “Concediu”.
- Demo in-memory stores; `reset*` in tests.
- Every new production line covered by a test (test-every-line).
- TDD: failing test first.
- No git commits unless user asks.
- Owner chrome: forest / ivory / coral only.

## Review Focus

- Closing a day with a booked hour: day stays partially closed; booked hour stays open with message.
- Pitch with custom 06–24 window: only those starts appear on chips and in player booking free hours.
- `/proprietar/calendar` redirect: old links land on rezervări.
- Nav must not highlight both Terenuri and a removed Teren nou path.
- Statistici filters change KPI values (not decorative).

---

### Task 1: Program store (default-open window + exceptions)

**Files:**
- Create: `src/lib/mock/program-store.ts`
- Create: `src/lib/mock/program-store.test.ts`
- Modify: `src/lib/mock/hours.ts` — export `startHoursInWindow(from, to)` and keep `OWNER_START_HOURS` as default window list (or derive from defaults)
- Modify: `src/lib/mock/slot-store.ts` — `isStartOpen` / open-close APIs respect program window + closed days/hours; `daysWithOpenHours` → prefer `daysClosed` / `isDayOpen` helpers from program-store for calendar marks
- Modify: `src/lib/mock/slot-store.test.ts`

**Interfaces:**
- Produces:
  - `getPitchProgram(pitchId): { startHour: string; endHour: string }`
  - `setPitchProgram(pitchId, startHour, endHour): void`
  - `isDayClosed(pitchId, day): boolean`
  - `setDayClosed(pitchId, day, closed: boolean): { ok: boolean; reason?: string }` — closing skips booked hours still open
  - `isHourClosed(pitchId, day, startHour): boolean`
  - `setHourClosed(pitchId, day, startHour, closed: boolean): { ok: boolean; reason?: string }`
  - `resetProgramStore(): void`
  - `startHoursInWindow(startHour, endHour): string[]` — half-hour starts where start ≥ window start and start+60min ≤ window end (or start ≤ last start that fits)
- Consumes: existing booking-store for active booking checks; hours.buildSlotRange

- [ ] **Step 1: Write failing tests** in `program-store.test.ts`: default day open inside 08–20:30; `setDayClosed` makes day closed; `setHourClosed` closes one start; `setPitchProgram("06:00","24:00")` widens starts; closing booked hour fails.

- [ ] **Step 2: Run** `npx vitest run src/lib/mock/program-store.test.ts` — expect FAIL.

- [ ] **Step 3: Implement program-store + wire `isStartOpen`** so open = in window ∧ ¬dayClosed ∧ ¬hourClosed ∧ (slot exists OR synthesize: prefer **virtual open** without requiring fixture slots — if fixtures still seed slots, treat missing slot as open when program says open: either ensure openAll on demand or change `isStartOpen` to not require store row). Spec: **virtual open** — `isStartOpen` true without inserting a slot until booked; booking creation still needs a slot id — keep `ensureStartSlot` when booking or when listing bookable slots.

- [ ] **Step 4: Run tests** — PASS. Update slot-store tests for new semantics.

---

### Task 2: Disponibilitate UI rewrite

**Files:**
- Modify: `src/app/proprietar/disponibilitate/page.tsx`
- Modify: `src/app/proprietar/disponibilitate/disponibilitate-page.test.tsx`
- Modify: pitch program link tests if copy changes

**Interfaces:**
- Consumes: program-store + SelectField; OwnerMonthCalendar with closed-day set

- [ ] **Step 1: Failing tests** — Combobox “Teren”; button name toggles “Azi deschis”/“Azi închis”; no “Concediu”; program start/end selects present.

- [ ] **Step 2: Implement UI** per sketch; mark closed days on calendar (`daysWithBookings` prop reused as closed markers or add `markedDays` — if prop name is bookings, pass closed set and rename prop to `markedDays` if cheap).

- [ ] **Step 3: Tests PASS.**

---

### Task 3: Merge Calendar into Rezervări + redirect

**Files:**
- Modify: `src/app/proprietar/rezervari/page.tsx` (+ tests)
- Modify: `src/app/proprietar/calendar/page.tsx` → redirect to `/proprietar/rezervari`
- Modify/move: calendar tests → rezervări tests for month + create booking
- Modify: `src/components/layout/dashboard-shell.tsx` + test — drop Calendar, Teren nou; Abonament label
- Modify: `src/components/layout/site-header.tsx` — owner links: Panou, Terenuri, Rezervări (no Calendar)
- Modify: `src/app/proprietar/terenuri/page.tsx` — CTA label “Adaugă teren”

**Interfaces:**
- Rezervări page: pitch SelectField (Toate + pitches), OwnerMonthCalendar, day bookings, OwnerCreateBookingForm, keep confirm/cancel; optional compact search for all bookings below or tab — **primary = month+day** from calendar page.

- [ ] **Step 1: Failing nav test** — no Calendar / Teren nou links; Abonament href `/proprietar/abonamente`.

- [ ] **Step 2: Implement nav + rezervări merge + calendar redirect.**

- [ ] **Step 3: Tests PASS** (owner-calendar tests updated to hit rezervări or redirect).

---

### Task 4: Abonament hub

**Files:**
- Modify: `src/app/proprietar/abonamente/page.tsx` + test
- Possibly small `CurrentPlanCard` in components/pricing

- [ ] **Step 1: Test** — heading “Abonament” or “Planul tău”; shows “Club” as current; change CTAs still demo.

- [ ] **Step 2: Implement** current plan banner + plans grid with current marked.

---

### Task 5: Statistici report filters

**Files:**
- Modify: `src/app/proprietar/statistici/page.tsx` + `owner-statistici.test.tsx`
- Possibly filter helpers in `crm-queries.ts`

- [ ] **Step 1: Test** — pitch Combobox + period control; changing pitch changes visible total (use known fixture counts).

- [ ] **Step 2: Implement** client filters; slim KPI strip (2–3 metrics); charts update; no fake calendar.

---

### Task 6: Verification

- [ ] **Step 1:** `npx vitest run` — all green.
- [ ] **Step 2:** Spot-check owner pages for ivory/forest consistency.

---

## Self-review

- Spec goals 1–7 mapped to Tasks 1–5.
- Commits skipped per user git rule.
