# Public Pricing Plans Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Public `/preturi` page with three cumulative owner plans (Club featured), linked from homepage and footer, with plan remembered into `/inregistrare` via query params.

**Architecture:** Shared `plans` config + `PricingPlans` UI. Public page and owner abonamente both render it. Signup CTAs use `/inregistrare?role=owner&plan={id}`; registration reads `useSearchParams` and shows the chosen plan.

**Tech Stack:** Next.js App Router, React 19, Vitest + Testing Library, existing `PageShell` / `Button` / theme tokens.

**Spec:** `docs/superpowers/specs/2026-11-23-public-pricing-plans-design.md`

## Global Constraints

- Romanian copy; forest / coral / ivory theme only.
- Demo only — no real payment.
- Plan persistence via URL query only (`role`, `plan`).
- Tests execute every new production line (`test-every-line`); TDD order (failing test → code → pass).
- Do **not** create git commits unless the user explicitly asks.
- Follow Next.js docs under `node_modules/next/dist/docs/` if App Router APIs are unclear.

## Review Focus

- Invalid `plan` query → registration still works; no plan summary shown.
- `plan` present without `role` → default role to `owner`.
- Owner `/proprietar/abonamente` after refactor still renders three plans with Club featured.
- Homepage CTA and footer link both point to `/preturi` (not `/proprietar/abonamente`).
- Cumulative feature first line for Club/Ligă is exactly `Tot din {previousName}`.

---

## File map

| File | Responsibility |
|------|----------------|
| `src/config/plans.ts` | Plan ids, prices, extras, `getPlan`, `planDisplayFeatures` |
| `src/config/plans.test.ts` | Config + cumulative features |
| `src/components/pricing/pricing-plans.tsx` | Three-plan grid UI |
| `src/components/pricing/pricing-plans.test.tsx` | Featured badge, cumulative copy, CTA hrefs |
| `src/app/preturi/page.tsx` | Public pricing page |
| `src/app/preturi/preturi-page.test.tsx` | Page shell + plans render |
| `src/app/page.tsx` | Homepage owner CTA |
| `src/app/home-owner-cta.test.tsx` | Homepage link to `/preturi` |
| `src/components/layout/site-footer.tsx` | Footer link |
| `src/components/layout/site-footer.test.tsx` | Footer link to `/preturi` |
| `src/app/inregistrare/page.tsx` | Read plan/role; show plan summary |
| `src/app/inregistrare/inregistrare-plan.test.tsx` | Prefill + remember plan |
| `src/app/proprietar/abonamente/page.tsx` | Use shared component (`ctaMode="none"`) |

---

### Task 1: Plans config

**Files:**
- Create: `src/config/plans.ts`
- Test: `src/config/plans.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `export type PlanId = "start" | "club" | "liga"`
  - `export type Plan = { id: PlanId; name: string; price: string; blurb: string; extras: string[]; featured?: boolean; featuredLabel?: string }`
  - `export const plans: Plan[]` — order Start, Club, Ligă
  - `export function getPlan(id: string): Plan | undefined`
  - `export function planDisplayFeatures(plan: Plan): string[]`

**Pinned values:**
- Start: `0 RON`, extras `["1 teren", "Calendar simplu", "Support email"]`, blurb `Un teren, rezervări de bază.`
- Club: `149 RON / lună`, featured, `featuredLabel: "Cel mai folosit"`, extras `["Până la 5 terenuri", "Statistici", "Anulări & rapoarte"]`, blurb `Mai multe terenuri pe zonă, statistici.`
- Ligă: `349 RON / lună`, extras `["Terenuri nelimitate", "Prioritate support", "Export date"]`, blurb `Operațiuni pe mai multe zone.`
- `planDisplayFeatures`: Start → its extras; Club → `["Tot din Start", ...club.extras]`; Ligă → `["Tot din Club", ...liga.extras]`

- [ ] **Step 1: Write the failing test** in `src/config/plans.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { getPlan, planDisplayFeatures, plans } from "./plans";

describe("plans", () => {
  it("orders Start, Club, Ligă with Club featured as Cel mai folosit", () => {
    expect(plans.map((p) => p.id)).toEqual(["start", "club", "liga"]);
    expect(plans[1]?.featured).toBe(true);
    expect(plans[1]?.featuredLabel).toBe("Cel mai folosit");
  });

  it("builds cumulative features as previous plan plus extras", () => {
    expect(planDisplayFeatures(plans[0]!)).toEqual([
      "1 teren",
      "Calendar simplu",
      "Support email",
    ]);
    expect(planDisplayFeatures(plans[1]!)[0]).toBe("Tot din Start");
    expect(planDisplayFeatures(plans[2]!)[0]).toBe("Tot din Club");
  });

  it("resolves known ids and rejects unknown", () => {
    expect(getPlan("club")?.name).toBe("Club");
    expect(getPlan("nope")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/config/plans.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Implement** `plans`, `getPlan`, `planDisplayFeatures` in `src/config/plans.ts` with the pinned values above

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/config/plans.test.ts`
Expected: PASS

---

### Task 2: PricingPlans component

**Files:**
- Create: `src/components/pricing/pricing-plans.tsx`
- Test: `src/components/pricing/pricing-plans.test.tsx`

**Interfaces:**
- Consumes: `plans`, `planDisplayFeatures` from `@/config/plans`; `Button`, `theme`
- Produces: `export function PricingPlans(props: { ctaMode: "signup" | "none" }): JSX.Element`
  - `signup`: each CTA is `Link` to `/inregistrare?role=owner&plan={id}`, label `Alege {name}`
  - `none`: same label, `Button` without navigation (owner dashboard)

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PricingPlans } from "./pricing-plans";

describe("PricingPlans", () => {
  it("highlights Club with Cel mai folosit and cumulative Tot din Start", () => {
    render(<PricingPlans ctaMode="signup" />);
    expect(screen.getByText("Cel mai folosit")).toBeInTheDocument();
    expect(screen.getByText("Tot din Start")).toBeInTheDocument();
    expect(screen.getByText("Tot din Club")).toBeInTheDocument();
  });

  it("links signup CTAs with role and plan query", () => {
    render(<PricingPlans ctaMode="signup" />);
    expect(screen.getByRole("link", { name: "Alege Club" })).toHaveAttribute(
      "href",
      "/inregistrare?role=owner&plan=club",
    );
  });

  it("renders non-linking choose buttons when ctaMode is none", () => {
    render(<PricingPlans ctaMode="none" />);
    expect(screen.queryByRole("link", { name: "Alege Club" })).toBeNull();
    expect(screen.getByRole("button", { name: "Alege Club" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/pricing/pricing-plans.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement** `PricingPlans` — three-column grid, coral border/background for featured, badge when `featuredLabel` set; reuse visual patterns from current `proprietar/abonamente/page.tsx`

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/pricing/pricing-plans.test.tsx`
Expected: PASS

---

### Task 3: Public `/preturi` page

**Files:**
- Create: `src/app/preturi/page.tsx`
- Test: `src/app/preturi/preturi-page.test.tsx`

**Interfaces:**
- Consumes: `PageShell`, `PricingPlans` with `ctaMode="signup"`
- Produces: default export page at `/preturi`

**Copy:**
- title: `Planuri pentru terenurile tale`
- description: `Alege planul, creează cont de proprietar, adaugă terenurile. UI demo, fără plată reală.`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PreturiPage from "./page";

describe("PreturiPage", () => {
  it("shows owner pricing heading and signup link for Club", () => {
    render(<PreturiPage />);
    expect(
      screen.getByRole("heading", { name: "Planuri pentru terenurile tale" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Alege Club" })).toHaveAttribute(
      "href",
      "/inregistrare?role=owner&plan=club",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/app/preturi/preturi-page.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement** `src/app/preturi/page.tsx`

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/app/preturi/preturi-page.test.tsx`
Expected: PASS

---

### Task 4: Homepage button + footer link

**Files:**
- Modify: `src/app/page.tsx` (hero CTA row)
- Modify: `src/components/layout/site-footer.tsx` (Contact list)
- Test: `src/app/home-owner-cta.test.tsx`
- Test: `src/components/layout/site-footer.test.tsx`

**Interfaces:**
- Homepage: ghost/secondary `Link` label `Adaugă-ți terenurile` → `/preturi`
- Footer: `Link` label `Planuri proprietari` → `/preturi`

- [ ] **Step 1: Write the failing tests**

```tsx
// home-owner-cta.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage owner CTA", () => {
  it("links Adaugă-ți terenurile to /preturi", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("link", { name: "Adaugă-ți terenurile" }),
    ).toHaveAttribute("href", "/preturi");
  });
});
```

```tsx
// site-footer.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("links Planuri proprietari to /preturi", () => {
    render(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: "Planuri proprietari" }),
    ).toHaveAttribute("href", "/preturi");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- src/app/home-owner-cta.test.tsx src/components/layout/site-footer.test.tsx`
Expected: FAIL

- [ ] **Step 3: Add the two links** in `page.tsx` and `site-footer.tsx`

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/app/home-owner-cta.test.tsx src/components/layout/site-footer.test.tsx`
Expected: PASS

---

### Task 5: Registration remembers plan

**Files:**
- Modify: `src/app/inregistrare/page.tsx`
- Test: `src/app/inregistrare/inregistrare-plan.test.tsx`

**Interfaces:**
- Consumes: `getPlan` from `@/config/plans`; `useSearchParams`
- Behavior:
  - Read `plan` and `role` from query.
  - If `getPlan(plan)` exists → show summary `Plan selectat: {name} · {price}` and default role to `owner` when `role` missing or when plan is present.
  - Role `SelectField` `defaultValue`: `owner` when plan valid or `role=owner`, else `player`.
  - Invalid plan → no summary; default role from `role` query or `player`.
  - On submit, if a valid plan id is present, append `&plan=` to confirmare-email URL (optional display later; still required so the chosen plan is not dropped at submit).

- [ ] **Step 1: Write the failing test** (mock `next/navigation` + `useDemoSession` like other app tests)

```tsx
const search = new URLSearchParams("role=owner&plan=club");
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => search,
}));
vi.mock("@/lib/demo-session", () => ({
  useDemoSession: () => ({ setRole: vi.fn() }),
}));

it("shows selected Club plan and owner role default", () => {
  render(<InregistrarePage />);
  expect(screen.getByText(/Plan selectat: Club/)).toBeInTheDocument();
  expect(screen.getByText(/149 RON/)).toBeInTheDocument();
});

it("hides plan summary for unknown plan id", () => {
  // remount with plan=nope — use a separate describe with its own mock, or set search string before import pattern used in repo
});
```

For invalid plan: second `describe` block with `useSearchParams: () => new URLSearchParams("plan=nope")`, assert no `/Plan selectat/` text.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/app/inregistrare/inregistrare-plan.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement** searchParams handling + plan summary UI on `inregistrare/page.tsx`

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/app/inregistrare/inregistrare-plan.test.tsx`
Expected: PASS

---

### Task 6: Owner abonamente uses shared component

**Files:**
- Modify: `src/app/proprietar/abonamente/page.tsx`
- Test: `src/app/proprietar/abonamente/abonamente-page.test.tsx`

**Interfaces:**
- Consumes: `PricingPlans` with `ctaMode="none"`
- Remove inline `plans` array

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OwnerPlansPage from "./page";

describe("OwnerPlansPage", () => {
  it("renders shared plans with featured Club and no signup links", () => {
    render(<OwnerPlansPage />);
    expect(screen.getByText("Cel mai folosit")).toBeInTheDocument();
    expect(screen.getByText("Tot din Start")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Alege Club" })).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails** (fails until page uses shared cumulative features / badge)

- [ ] **Step 3: Replace page body** with `PageShell` + `<PricingPlans ctaMode="none" />`; keep title `Abonamente` and demo description

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/app/proprietar/abonamente/abonamente-page.test.tsx`
Expected: PASS

- [ ] **Step 5: Full suite**

Run: `npm test`
Expected: PASS (all existing + new)
