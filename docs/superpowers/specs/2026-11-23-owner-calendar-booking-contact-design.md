# Owner calendar, booking contact & confirmation — design

## Intent

Owners need a usable month calendar of bookings, clear player contact (email + phone), actions behind a ⋮ menu, player bookings that require email+phone with a separate email confirmation code step, and the ability to create a booking themselves when someone calls.

## Why

Current owner calendar is a fixed 14-day strip, hard to use. Owner booking lists show no contact. Booking has no phone and no confirmation-of-reservation flow. Phone-in bookings have no owner path.

## Goals

1. **Owner calendar** (`/proprietar/calendar`): normal month grid, prev/next month, pitch filter. Days with bookings marked. Click a day → panel/list of that day’s bookings ordered by time, each with pitch, hour, status, **email**, **phone under email** (visually distinct labels).
2. **Actions**: no row of Confirmă/Anulează buttons. Always a **⋮** menu → Confirmă / Anulează (and later others). Same pattern on calendar day list and `/proprietar/rezervari` table.
3. **Contact on booking**: every booking stores `contactEmail` + `contactPhone`. Display: email on top, phone below, labeled so they don’t look the same.
4. **Player booking flow**: create booking requires name (or host), email, phone → booking starts as **pending confirmation** → `/confirmare-rezervare` (code + **retrimitere cod**, demo: any 6 chars) → status becomes confirmed/open as today’s model allows.
5. **Owner (patron) creates booking from calendar**: when someone calls, owner picks day (or from day panel) → “Rezervare nouă” → pitch, slot/hour, guest name, email, phone → creates booking (owner-created may skip email code or mark confirmed immediately — **builder default: confirmed**, since the call already verified the person; still store email+phone for contact).
6. Demo only; no real SMS/email send.

## Non-goals

- Real email/SMS providers.
- Changing pitch weekly schedule / disponibilitate (separate request).
- Full CRM rewrite.
- Platform `/admin` rebuild (unless trivial reuse); primary “administrator” here is the **pitch owner** managing the venue. Platform admin can keep existing list; not required for v1 phone-in flow.

## Anti-goals

- Calendar that doesn’t let you open a day.
- Contact shown as one undifferentiated blob.
- Visible Confirm/Cancel button stacks instead of ⋮.
- Mixing account email-confirm with booking confirm (separate routes/copy).

## Constraints

- Romanian UI; existing theme tokens.
- Mock data + client state (or in-memory mock store) for create/update.
- Tests for every new production line; TDD.
- Extend `BookingStatus` with `pending` (or equivalent) for unconfirmed player bookings.

## Approaches

1. **Single package on current routes** (chosen): redesign `/proprietar/calendar`, kebab on list+calendar, booking fields + `/confirmare-rezervare`, owner “Rezervare nouă” from calendar.
2. Calendar + contact only; defer confirmation — rejected by user.
3. Heavy separate detail routes only — more clicks, worse for phone-in.

## Design sketch

```
[ < Noiembrie 2026 > ]  [Toate | Teren A | Teren B]

  Lu Ma Mi Jo Vi Sa Du
  …  1  2  3  4  5  6
  7  8 [9•] 10 …        ← • = are rezervări; click 9

  Ziua 9 noiembrie                    [+ Rezervare nouă]
  18:00  Verde Nord 1   Confirmată    ⋮
         Email  andrei@…
         Telefon  07xx…
  20:00  …                            ⋮
```

**Player after book:** redirect to confirmare-rezervare?bookingId=&email= → enter code / resend (demo toast).

**Kebab:** shared `ActionMenu` component (button ⋮, menu items).

## Left to builder

- Exact pending → confirmed mapping vs existing `open`/`full`.
- Whether day panel is side drawer vs below-calendar section (prefer below or side panel on large screens; one composition, not a dashboard of cards).
- Phone format validation (RO mobile loose check is enough).
- Whether platform admin gets the same calendar later (out of v1).
