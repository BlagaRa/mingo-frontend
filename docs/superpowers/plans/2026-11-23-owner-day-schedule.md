# Owner Day Schedule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (inline — user wants to see UI soon) or subagent-driven-development.

**Goal:** Workable Disponibilitate day-calendar with 30-min start grid, 1h slots, slot store, vacation range, teren deep-link — clean UI for owner to tweak after seeing it.

**Architecture:** `slot-store` seeds from fixtures; schedule/booking helpers read it; Disponibilitate rewritten around OwnerMonthCalendar + half-hour chips; teren page links in.

**Tech Stack:** Next.js, Vitest, existing owner calendar / theme.

**Spec:** `docs/superpowers/specs/2026-11-23-owner-day-schedule-design.md`

## Global Constraints

- Romanian UI; forest/coral/ivory.
- Starts `:00`/`:30`; duration always 1 hour.
- No duplicate editor on teren.
- TDD; test-every-line; no commits unless asked.
- Work in `frontend/`.

## Review Focus

- Closing an hour with active booking is blocked (or skipped) with feedback.
- Concediu range closes multiple days without wiping booked hours silently.
- Player `freeBookableHoursForDay` respects overlap of 1h windows.
- `?pitch=` preselects pitch on Disponibilitate.
- Half-hour chips show 11:00 and 11:30 as separate starts.

---

### Task 1: OWNER_START_HOURS + slot-store

**Files:** `src/lib/mock/schedule.ts`, `src/lib/mock/slot-store.ts`, tests

- `OWNER_START_HOURS`: 08:00…20:30 step 30m
- `buildSlotTimes(day, startHour)` → startsAt/endsAt (+1h, +02:00)
- Store: `listSlots`, `getSlot`, `slotsForPitch`, `slotsForPitchDay`, `isStartOpen`, `setStartOpen`, `openAllStarts`, `closeDay`, `closeDayRange`, `daysWithOpenHours`, `resetSlotStore`
- `setStartOpen(false)` fails if non-cancelled booking on that slot
- Update `availableDays` / `freeHoursForDay` to use `listSlots()`
- Update `queries.getSlot` / `slotsForPitch` to store
- Update `freeBookableHoursForDay` for overlap

### Task 2: Disponibilitate page rewrite

Month calendar, one pitch (default first / `?pitch=`), day panel chips, open/close day, concediu from–to, booked hours disabled with label.

### Task 3: Teren deep-link

Replace Intervale list with summary + Editează programul.

### Task 4: Verify

`npm test`, `npm run build` from `frontend/`.
