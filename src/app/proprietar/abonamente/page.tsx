import { PageShell } from "@/components/layout/page-shell";
import { PricingPlans } from "@/components/pricing/pricing-plans";

export default function OwnerPlansPage() {
  return (
    <PageShell
      title="Abonamente"
      description="Compară planurile — UI demo, fără plată reală."
    >
      <PricingPlans ctaMode="none" />
    </PageShell>
  );
}
