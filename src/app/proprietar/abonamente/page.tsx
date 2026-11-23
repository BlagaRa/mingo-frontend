import { PageShell } from "@/components/layout/page-shell";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { planDisplayFeatures, getPlan } from "@/config/plans";
import { theme } from "@/config/theme";

const DEMO_CURRENT_PLAN_ID = "club" as const;

export default function OwnerPlansPage() {
  const current = getPlan(DEMO_CURRENT_PLAN_ID)!;
  const features = planDisplayFeatures(current);

  return (
    <PageShell
      title="Abonament"
      description="Planul activ și ce poți schimba — demo, fără plată reală."
    >
      <section className="mb-12 grid gap-8 border-b border-[color-mix(in_srgb,var(--color-ivory)_12%,transparent)] pb-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-sm opacity-70">Planul tău</p>
          <h2
            data-testid="current-plan-name"
            className="mt-2 font-display text-4xl font-semibold tracking-tight text-[var(--color-ivory)]"
          >
            {current.name}
          </h2>
          <p className="mt-3 max-w-[36ch] text-sm opacity-80">{current.blurb}</p>
          <p
            className="mt-6 font-display text-2xl font-semibold"
            style={{ color: theme.colors.coral }}
          >
            {current.price}
          </p>
        </div>
        <ul className="space-y-2 self-center text-sm text-[var(--color-ivory)]">
          {features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span aria-hidden="true" className="opacity-40">
                ·
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <h2 className="mb-2 font-display text-xl font-semibold text-[var(--color-ivory)]">
        Alte planuri
      </h2>
      <p className="mb-6 max-w-[48ch] text-sm opacity-75">
        Compară și schimbă când vrei — în demo butoanele nu iau plată.
      </p>
      <PricingPlans ctaMode="change" currentPlanId={DEMO_CURRENT_PLAN_ID} />
    </PageShell>
  );
}
