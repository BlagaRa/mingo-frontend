import { PageShell } from "@/components/layout/page-shell";
import { PricingPlans } from "@/components/pricing/pricing-plans";

export default function PreturiPage() {
  return (
    <PageShell
      title="Planuri pentru terenurile tale"
      description="Alege planul, creează cont de proprietar, adaugă terenurile. UI demo, fără plată reală."
    >
      <PricingPlans ctaMode="signup" />
    </PageShell>
  );
}
