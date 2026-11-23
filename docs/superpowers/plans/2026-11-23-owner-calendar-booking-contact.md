# Owner Calendar, Booking Contact & Confirmation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Usable owner month calendar with day detail + contact, ⋮ actions, player bookings with email/phone + email confirmation code, and owner phone-in booking from the calendar.

**Architecture:** Extend mock `Booking` with contact fields and `pending` status; shared `ActionMenu` + `BookingContact`; redesign `/proprietar/calendar` with month grid + day panel + “Rezervare nouă”; player `/rezervari/nou` collects contact then `/confirmare-rezervare`; in-memory booking store for create/confirm/cancel in the demo session.

**Tech Stack:** Next.js App Router, React 19, Vitest + Testing Library, existing `PageShell` / `Dialog` / `schedule.ts` month helpers / theme tokens.

**Spec:** `docs/superpowers/specs/2026-11-23-owner-calendar-booking-contact-design.md`

## Global Constraints

- Romanian UI; forest / coral / ivory theme only.
- Demo only — no real email/SMS; any 6-char code confirms a booking.
- Account confirm (`/confirmare-email`) stays separate from booking confirm (`/confirmare-rezervare`).
- Owner phone-in bookings are created as `confirmed` with contact stored.
- Player-created bookings start as `pending`, become `open` after code confirm (keeps seat-filling model).
- Tests execute every new production line; TDD (fail → pass).
- Do **not** create git commits unless the user explicitly asks.
- No git repo may exist — work in place; skip worktree if unavailable.
- Do not expand into pitch weekly-schedule / disponibilitate work.

## Review Focus

- Day with zero bookings still selectable; panel shows empty state, not crash.
- Month navigation across year boundary (Dec ↔ Jan) keeps correct cells.
- `pending` bookings appear in owner day list and filters with label Neconfirmată.
- Invalid phone on player form blocks submit with visible error; email without `@` same.
- Resend code on confirmare-rezervare shows feedback without navigating away.

---

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/mock/types.ts` | `BookingStatus` + `pending`; `Booking.contactEmail`, `contactPhone`, `contactName` |
| `src/lib/mock/fixtures.ts` | Seed contact on existing bookings; add phones on sample users optional |
| `src/lib/mock/booking-display.ts` | Labels/tones/filters for `pending` |
| `src/components/ui/status-badge.tsx` | Icon for `pending` |
| `src/lib/mock/booking-store.ts` | In-memory list: `listBookings`, `upsertBooking`, `getBooking`, `confirmBooking` |
| `src/components/ui/action-menu.tsx` | ⋮ menu |
| `src/components/booking/booking-contact.tsx` | Email + Telefon stack |
| `src/components/owner/owner-month-calendar.tsx` | Month grid + selection |
| `src/app/proprietar/calendar/page.tsx` | Wire calendar, day panel, create dialog |
| `src/app/proprietar/rezervari/page.tsx` | Contact column + ⋮ instead of buttons |
| `src/app/rezervari/nou/page.tsx` | Contact fields → pending → redirect |
| `src/app/confirmare-rezervare/page.tsx` | Code + resend |

---

### Task 1: Booking contact + pending in mock model

**Files:**
- Modify: `src/lib/mock/types.ts`
- Modify: `src/lib/mock/booking-display.ts`
- Modify: `src/lib/mock/booking-display.test.ts`
- Modify: `src/components/ui/status-badge.tsx`
- Modify: `src/components/ui/status-badge.test.tsx` (if present; else create assertions in booking-display tests + badge test)
- Modify: `src/lib/mock/fixtures.ts` — every booking gets `contactName`, `contactEmail`, `contactPhone`
- Create: `src/lib/mock/booking-store.ts`
- Test: `src/lib/mock/booking-store.test.ts`

**Interfaces:**
- Produces:
  - `BookingStatus = "open" | "full" | "confirmed" | "cancelled" | "pending"`
  - `Booking` fields: `contactName: string; contactEmail: string; contactPhone: string`
  - `bookingStatusLabel("pending") === "Neconfirmată"`
  - `BOOKING_STATUS_FILTERS` includes `"pending"`
  - `bookingStatusTone("pending")` uses a distinct muted/coral-soft style (not same as cancelled)
  - `export function listBookings(): Booking[]` — starts from fixtures copy
  - `export function getBooking(id: string): Booking | undefined`
  - `export function upsertBooking(booking: Booking): void`
  - `export function confirmBooking(id: string): Booking | undefined` — sets `status` to `"open"` if was `"pending"`

**Pinned fixture phones:** use `07xx` style e.g. `0721123456` for host contacts derived from known users where possible.

- [ ] **Step 1: Write failing tests** for pending label/tone/filter and booking-store confirm

```ts
expect(bookingStatusLabel("pending")).toBe("Neconfirmată");
expect(BOOKING_STATUS_FILTERS).toContain("pending");
// store:
upsertBooking({ ...pendingBooking });
expect(confirmBooking(pendingBooking.id)?.status).toBe("open");
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npm test -- src/lib/mock/booking-display.test.ts src/lib/mock/booking-store.test.ts`

- [ ] **Step 3: Implement types, display, fixtures contact fields, status-badge pending icon, booking-store**

Update all `Booking` object literals in fixtures/tests that TypeScript breaks.

- [ ] **Step 4: Run tests — expect PASS**

Also run: `npm test -- src/components/ui/status-badge.test.tsx` (extend if needed for pending icon `data-testid="status-icon-pending"`).

**Review Focus coverage:** pending label in filters — assert in booking-display test.

---

### Task 2: ActionMenu + BookingContact

**Files:**
- Create: `src/components/ui/action-menu.tsx`
- Test: `src/components/ui/action-menu.test.tsx`
- Create: `src/components/booking/booking-contact.tsx`
- Test: `src/components/booking/booking-contact.test.tsx`

**Interfaces:**
- `export type ActionMenuItem = { id: string; label: string; danger?: boolean; onSelect: () => void }`
- `export function ActionMenu(props: { label?: string; items: ActionMenuItem[] }): JSX.Element`
  - Trigger: `aria-label` default `Acțiuni`, visible `⋯`
  - Opens menu; Escape / outside click closes; choosing item calls `onSelect` and closes
- `export function BookingContact(props: { email: string; phone: string }): JSX.Element`
  - Renders two rows: label `Email` then value; label `Telefon` then value (Telefon under Email)
  - Labels use distinct styling (e.g. small opacity label vs value) so they don’t look identical

- [ ] **Step 1: Write failing tests**

```tsx
// action-menu: click ⋯ → see Confirmă; click Confirmă → onSelect called; no Confirmă button outside menu
// booking-contact:
expect(screen.getByText("Email")).toBeInTheDocument();
expect(screen.getByText("Telefon")).toBeInTheDocument();
expect(screen.getByText("andrei@example.com")).toBeInTheDocument();
expect(screen.getByText("0721123456")).toBeInTheDocument();
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement components** (accessible button + menu; no new dependency)

- [ ] **Step 4: Run — expect PASS**

---

### Task 3: Owner month calendar + day panel

**Files:**
- Create: `src/components/owner/owner-month-calendar.tsx`
- Test: `src/components/owner/owner-month-calendar.test.tsx`
- Modify: `src/app/proprietar/calendar/page.tsx`
- Test: `src/app/proprietar/calendar/owner-calendar.test.tsx`

**Interfaces:**
- Consumes: `buildMonthGrid` / `shiftMonth` / `formatMonthTitle` from `@/lib/mock/schedule` (reuse player helpers); `listBookings`, `getPitch`, `getSlot`, `slotDay`, `formatHour`
- `OwnerMonthCalendar({ year, month, selectedDay, daysWithBookings: Set<string>, onSelectDay, onShiftMonth })`
- Page: pitch filter; selected day panel below calendar listing bookings for that day sorted by `startsAt`, each row: time, pitch name, `StatusBadge`, `BookingContact`, `ActionMenu` (Confirmă if pending/open, Anulează if not cancelled)
- Empty day: `EmptyState` title `Nicio rezervare în această zi`
- Mark days that have ≥1 non-irrelevant booking (include pending/confirmed/open/full; still show cancelled with muted style)

**Review Focus tests in this task:**
- Select empty day → empty state
- From month 11 year 2026 shift +1 → title contains `decembrie` / `2026` or `ianuarie` as appropriate; cells still render

- [ ] **Step 1: Write failing calendar component + page tests**

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement calendar component and rewrite page** (replace 14-day strip)

- [ ] **Step 4: Run — expect PASS**

---

### Task 4: Owner rezervări list — contact + ⋮

**Files:**
- Modify: `src/app/proprietar/rezervari/page.tsx`
- Test: `src/app/proprietar/rezervari/owner-rezervari-actions.test.tsx`

**Interfaces:**
- Columns include Contact (render `BookingContact`) and Acțiuni (`ActionMenu` only — **no** Confirmă/Anulează as standalone buttons)
- Use `listBookings` filtered by owner (or keep `ownerBookings` but merge store updates — prefer reading from store filtered by owner pitches)

- [ ] **Step 1: Write failing test** — no `getByRole("button", { name: "Confirmă" })` at rest; open ⋮ then Confirmă appears; contact email/phone visible

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Replace action buttons with ActionMenu; add BookingContact column**

- [ ] **Step 4: Run — expect PASS**

---

### Task 5: Player booking requires email + phone → pending → confirm route

**Files:**
- Modify: `src/app/rezervari/nou/page.tsx`
- Test: `src/app/rezervari/nou/booking-contact-fields.test.tsx`
- Helper: `src/lib/mock/phone.ts` — `export function isValidRoPhone(value: string): boolean` (digits, length 10, starts with 07 after stripping spaces)

**Interfaces:**
- Form fields: `contactName`, `contactEmail`, `contactPhone` (required)
- On valid submit: `upsertBooking` with `status: "pending"`, new id `b-demo-…`, then `router.push(/confirmare-rezervare?bookingId=…&email=…)`
- Invalid phone → error `Introdu un telefon valid (07…)`

**Review Focus:** invalid phone blocks submit — assert in this task’s test.

- [ ] **Step 1: Write failing tests** (fields present; bad phone shows error; good submit pushes confirm URL — mock router + store)

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement validation + store write + redirect** (stop hardcoding `/rezervari/b-1` as success)

- [ ] **Step 4: Run — expect PASS**

---

### Task 6: `/confirmare-rezervare` page

**Files:**
- Create: `src/app/confirmare-rezervare/page.tsx`
- Test: `src/app/confirmare-rezervare/confirmare-rezervare.test.tsx`
- Mirror Suspense pattern from `confirmare-email/page.tsx`

**Interfaces:**
- Reads `bookingId`, `email` from searchParams
- Copy: title `Confirmă rezervarea`; description mentions email (not account signup)
- Code input 6 chars → `confirmBooking(id)` → navigate `/rezervari/{id}`
- Button `Retrimite codul` → sets feedback text `Am retrimis codul (demo).` without navigation
- Wrap `useSearchParams` in `Suspense` + Skeleton (`Se încarcă confirmarea rezervării`)

**Review Focus:** resend stays on page with message — test in this task.

- [ ] **Step 1: Write failing tests** (confirm + resend + suspense skeleton)

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement page**

- [ ] **Step 4: Run — expect PASS**

---

### Task 7: Owner “Rezervare nouă” from calendar (phone-in)

**Files:**
- Modify: `src/app/proprietar/calendar/page.tsx` (dialog/form)
- Create: `src/components/owner/owner-create-booking-form.tsx` (optional extract if page grows)
- Test: `src/app/proprietar/calendar/owner-create-booking.test.tsx`

**Interfaces:**
- Button `Rezervare nouă` on day panel (disabled if no day selected — or enables and defaults day)
- Fields: pitch (owner’s), hour/slot for that day (from `freeHoursForDay` or OWNER_HOURS creating a synthetic slot id in store if needed), `contactName`, `contactEmail`, `contactPhone`
- Submit → `upsertBooking` with `status: "confirmed"`, appears in day list immediately
- If no real slot exists for hour: create slot-like booking using an existing free slot for that pitch/day when available; otherwise builder may add `createDemoSlot(pitchId, day, hour)` in booking-store/schedule helper — keep minimal

- [ ] **Step 1: Write failing test** — open form, fill, submit, see contact + Confirmată in day list

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement create flow**

- [ ] **Step 4: Run task tests + full suite**

Run: `npm test`
Expected: PASS for all tests touched by this plan; report any pre-existing failures by name without “fixing” unrelated rezervari getByText issues unless this change caused them.

- [ ] **Step 5: `npm run build`** — must succeed (Suspense on confirmare-rezervare)
