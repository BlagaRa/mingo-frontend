import Link from "next/link";
import { Button } from "@/components/ui/button";
import { planDisplayFeatures, plans, type PlanId } from "@/config/plans";
import { theme } from "@/config/theme";

type PricingPlansProps = {
  ctaMode: "signup" | "none" | "change";
  currentPlanId?: PlanId;
};

export function PricingPlans({ ctaMode, currentPlanId }: PricingPlansProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {plans.map((plan) => {
        const features = planDisplayFeatures(plan);
        const chooseLabel = `Alege ${plan.name}`;
        const isCurrent = currentPlanId === plan.id;

        return (
          <article
            key={plan.id}
            className="relative flex flex-col rounded-[var(--radius-md)] border bg-[var(--color-surface-muted)] p-5 transition-[border-color,box-shadow] duration-[var(--motion-hover-ms)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_10px_24px_color-mix(in_srgb,var(--color-ivory)_10%,transparent)]"
            style={{
              borderColor: isCurrent
                ? theme.colors.coral
                : "color-mix(in srgb, #F7F5ED 14%, transparent)",
            }}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-display text-xl font-semibold text-[var(--color-ivory)]">
                {plan.name}
              </h2>
              {isCurrent ? (
                <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-[var(--color-coral)]">
                  Activ
                </span>
              ) : plan.featuredLabel ? (
                <span className="text-[0.7rem] font-semibold uppercase tracking-wide opacity-60">
                  {plan.featuredLabel}
                </span>
              ) : null}
            </div>
            <p className="text-sm opacity-75">{plan.blurb}</p>
            <p
              className="mt-4 font-display text-2xl font-semibold"
              style={{ color: theme.colors.ivory }}
            >
              {plan.price}
            </p>
            <ul className="mt-4 flex-1 space-y-1.5 text-sm opacity-90">
              {features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span aria-hidden="true" className="opacity-35">
                    ·
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {ctaMode === "signup" ? (
              <Button
                asChild
                className="mt-6"
                variant={plan.featured ? "accent" : "primary"}
              >
                <Link href={`/inregistrare?role=owner&plan=${plan.id}`}>
                  {chooseLabel}
                </Link>
              </Button>
            ) : ctaMode === "change" ? (
              <Button
                className="mt-6"
                type="button"
                variant={isCurrent ? "ghost" : "primary"}
                disabled
              >
                {isCurrent ? "Plan curent" : `Schimbă la ${plan.name}`}
              </Button>
            ) : (
              <Button
                className="mt-6"
                type="button"
                variant={plan.featured ? "accent" : "primary"}
                disabled
              >
                Demo — fără plată
              </Button>
            )}
          </article>
        );
      })}
    </div>
  );
}
