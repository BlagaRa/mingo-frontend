import Link from "next/link";
import { Button } from "@/components/ui/button";
import { planDisplayFeatures, plans } from "@/config/plans";
import { theme } from "@/config/theme";

type PricingPlansProps = {
  ctaMode: "signup" | "none";
};

export function PricingPlans({ ctaMode }: PricingPlansProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {plans.map((plan) => {
        const features = planDisplayFeatures(plan);
        const chooseLabel = `Alege ${plan.name}`;

        return (
          <article
            key={plan.id}
            className="relative flex flex-col rounded-[var(--radius-md)] border p-6 transition-[transform] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1"
            style={{
              borderColor: plan.featured
                ? theme.colors.coral
                : "color-mix(in srgb, #073035 14%, transparent)",
              backgroundColor: plan.featured
                ? theme.colors.coralSoft
                : theme.colors.ivory,
            }}
          >
            {plan.featuredLabel ? (
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-wide"
                style={{ color: theme.colors.forest }}
              >
                {plan.featuredLabel}
              </p>
            ) : null}
            <h2 className="font-display text-2xl font-semibold text-[var(--color-forest)]">
              {plan.name}
            </h2>
            <p className="mt-2 text-sm opacity-80">{plan.blurb}</p>
            <p
              className="mt-4 font-display text-3xl font-semibold"
              style={{
                color: plan.featured
                  ? theme.colors.forest
                  : theme.colors.forestFill,
              }}
            >
              {plan.price}
            </p>
            <ul className="mt-5 flex-1 space-y-2 text-sm">
              {features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span aria-hidden="true">·</span>
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
