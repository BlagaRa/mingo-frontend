# Owner UX cleanup — design

**Status:** approved (user confirmed: drop Calendar into Rezervări; program default-open; combobox; nav/stats/abonament polish)

## Intent

Make the owner space easy to run with many pitches: one place for hours (default open, close exceptions), one place for bookings (list + month), one pitch picker, one “Terenuri” entry, a real Abonament hub, and quieter Statistici that filter like a report.

## Why

Today Disponibilitate is opt-in per hour with “Concediu” and pitch tabs; Calendar and Rezervări overlap; nav has Teren nou + Calendar; Statistici feels like toy KPI cards; Abonamente is a naked pricing grid; pages don’t feel like one product.

## Goals

1. **Program model:** each pitch has a daily window (e.g. 08:00–20:30 or 06:00–24:00). Within that window, **every day is open by default**. Owner only **closes** a whole day or individual starts. Same control: “Azi deschis” ↔ “Azi închis”. No “Concediu” wording.
2. **Disponibilitate UI:** top **Combobox** for pitch; month calendar; day panel with single day toggle + hour chips to close/open; controls to set the window (start/end hour). Mark closed days on the calendar.
3. **Rezervări only:** remove Calendar from owner nav and site-header. `/proprietar/rezervari` gets month view + day list + “Rezervare nouă” (move from calendar page). Pitch Combobox (“Toate” + each pitch). Keep list/table as the default or a clear Lista | Lună switch — prefer **Lună + listă zilei** as primary (what Calendar did) with a compact **Toate** list toggle if needed; simplest: one page = pitch filter + month + day bookings + CTA, plus existing search/status for “toate”.
4. **Nav:** Panou · Terenuri · Rezervări · Disponibilitate · Statistici · Abonament. Drop Calendar and Teren nou. Terenuri page keeps **Adaugă teren** button (route `/terenuri/nou` stays).
5. **Abonament:** show **current plan** (demo: Club) + change-plan grid with “Plan curent” / “Schimbă la …” (demo disabled CTAs still ok, but layout is plan hub not bare pricing dump). Label nav **Abonament**.
6. **Statistici:** report chrome — period + pitch filters that actually change the numbers/charts; less card noise (fewer KPIs or one summary strip), no decorative non-filtering calendar.
7. **Visual unify:** all owner pages use PageShell + ivory main + forest/coral tokens only; same pitch Combobox pattern; no one-off accent backgrounds per page.

## Non-goals

- Backend persistence / real payments.
- Weekly recurring templates beyond the daily window.
- Deleting `/proprietar/calendar` route immediately if redirects help; nav must not link it (redirect to rezervări is fine).

## Anti-goals

- Opt-in empty days that force “Deschide ziua” before anything works.
- 20 pitch tabs.
- Two booking hubs (Calendar + Rezervări).
- “Concediu” or vacation jargon for closing days.

## Approaches

1. **Default-open window + closed exceptions store** (chosen). Slot catalog for a day = window starts minus closed hours/days. Booking UIs call `isStartOpen` / list free starts from that.
2. Keep opt-in slot store only — rejected (user wants always open).
3. Keep Calendar page, deep-link from Rezervări — rejected (user chose merge).

## Design sketch

```
Disponibilitate
Teren [ Verde Nord 1 ▾ ]   Program [08:00 ▾]–[20:30 ▾]

[< Dec 2026 >]     zile închise marcate

Marți 10 dec · [ Azi deschis ]   ← același buton, toggle
08:00 liber | 08:30 închis | …   (click = închide/deschide ora)
```

```
Rezervări
Teren [ Toate ▾ ]  [ Rezervare nouă ]
[< Dec 2026 >]
Ziua … listă rezervări + confirm/anulează
```

```
Abonament
Planul tău: Club · 149 lei/lună
[ compară / schimbă planuri ]
```

## Decisions (builder calls)

- Window stored per pitch in a small in-memory `program-store` (startHour, endHour) + closed-day set + closed-start set; `isStartOpen` = in window ∧ ¬dayClosed ∧ ¬hourClosed (and still block closing booked hours).
- Default window 08:00–20:30 (current OWNER_START_HOURS bounds); owner can widen toward 06:00–23:30.
- Calendar route redirects to `/proprietar/rezervari`.
- Statistici filters: pitch select + last 7 / 30 / all (demo series filtered client-side).
