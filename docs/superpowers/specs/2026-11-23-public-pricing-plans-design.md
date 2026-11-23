# Public pricing plans — design

## Intent

Owners need a public path to add pitches: discover plans, pick one, register as owner with that plan remembered. Players keep the current homepage; owners get a clear funnel.

## Why

Homepage and footer today only serve players. Plan UI exists only behind `/proprietar/abonamente` and does not feed signup.

## Goals

- Public page `/preturi` with 3 plans (Start, Club, Ligă).
- Homepage button + footer link to `/preturi`.
- Middle plan (Club) highlighted as most used.
- Each plan shown as previous tier + extras (cumulative).
- “Alege {plan}” → `/inregistrare?role=owner&plan={id}`; form preselects role + plan and shows the chosen plan.
- Shared plan config reused by `/preturi` and `/proprietar/abonamente`.
- Still demo: no real payment.

## Non-goals

- Real billing / Stripe.
- Persisting plan in a backend.
- Changing player booking flow.
- Session/localStorage for plan (URL query only).

## Anti-goals

- Plans only visible after owner login.
- Parallel feature lists that hide “previous + more”.
- Dead “Alege” buttons.

## Constraints

- Match existing Mingo theme (forest / coral / ivory).
- Romanian copy.
- Tests for every new production line (project rule).

## Approaches

1. **Public `/preturi` + plan in URL** (chosen) — shareable, simple, fits demo.
2. `/preturi` + session storage — more resilient, extra complexity without payment.
3. Plans only on `/inregistrare` — no dedicated page for footer/share.

## Design

- **Config:** `src/config/plans.ts` — id, name, price, blurb, `baseFeatures` / `extras` (or equivalent), `featured` on Club with badge copy e.g. “Cel mai folosit”.
- **UI:** shared `PricingPlans` component; public page uses `PageShell`; owner abonamente imports same component (owner CTAs can stay “manage” / non-signup or same choose link as appropriate for logged-in owners — builder call: on owner page, keep informational / non-signup CTA or link to stay on dashboard; public page CTAs go to signup).
- **Homepage:** secondary CTA e.g. “Adaugă-ți terenurile” → `/preturi`.
- **Footer:** link under Contact (or a small Proprietari column) → `/preturi`.
- **Înregistrare:** read `role` + `plan` from searchParams; default role to owner when plan present; show selected plan name/price; pass `plan` through to confirmare-email query if useful for demo display (builder call: show on confirm/success only if trivial; minimum is show on registration form).

## Left to builder

- Exact cumulative feature copy.
- Whether owner `/proprietar/abonamente` CTA stays decorative or links elsewhere.
- Passing plan past email confirm into owner dashboard (optional; not required for v1 if form shows it).
