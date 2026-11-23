# Owner day-calendar schedule — design

## Intent

Owners set which hours are bookable **per calendar day**, in one place. Pitch edit and nav don’t duplicate that job — they deep-link into it. Changes persist in a slot store so players and phone-in booking see the same hours.

## Why

Disponibilitate toggles are local-only. Teren „Intervale” is read-only. Slot catalog is static fixtures. Owners can’t actually open/close hours.

## Goals

1. **Single editor:** `/proprietar/disponibilitate` — month calendar, select day, toggle **start times** for one pitch (`?pitch=` deep-link).
2. **Grid:** starts every **30 minutes** (11:00, 11:30, …). Each open start is a **1-hour** bookable slot (11:00→12:00). No 30-minute bookings.
3. **Persistence:** in-memory **slot store** (seeded from fixtures). Player/owner booking UIs read from it. Overlap-aware: a booking blocks other starts that overlap its hour.
4. **Concediu:** close a **date range** (all starts removed / day closed) in one action, with warning if some hours have active bookings (skip those, report count).
5. **Teren page:** no second editor — summary + **Editează programul** → disponibilitate?pitch=.
6. **Clean UI:** one pitch, month, day panel, compact half-hour chips, few controls (open/close day, concediu range).
7. Demo only; no backend.

## Non-goals

- Weekly recurring template on Pitch (Luni–Duminică forever).
- Second full editor on teren page.
- Real multi-device sync.

## Anti-goals

- Two pages that both edit the same hours differently.
- Cosmetic toggles that don’t change player booking options.
- Deleting a slot under an active booking without feedback.

## Approaches

1. **Disponibilitate-only editor + teren deep-link** (chosen).
2. Editor only on teren; drop Disponibilitate — rejected (user wants one hub).
3. Same component on two routes — rejected (duplicate pages).

## Design sketch

```
Disponibilitate
[ Teren: Verde Nord 1 ▾ ]

[ < Decembrie 2026 > ]     month grid; days with open hours marked

Ziua 9 decembrie
08 09 10 … 18[liber] 19[închis] …
[Deschide toată ziua] [Închide toată ziua]
Ore cu rezervări active: blocate / avertisment
```

Teren edit: „Program: 12 zile cu ore deschise” + link.

## Left to builder

- Exact hour duration (1h aligned with OWNER_HOURS).
- Whether closing a booked hour is blocked vs cancel-first message.
- Whether `?day=` is also supported in the query.
