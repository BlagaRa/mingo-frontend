import { BarChart } from "@/components/crm/bar-chart";
import { KpiCard } from "@/components/crm/kpi-card";
import { TrendChart } from "@/components/crm/trend-chart";
import { PageShell } from "@/components/layout/page-shell";
import { DEMO_OWNER_ID } from "@/lib/mock/demo";
import { ownerBookingSeries } from "@/lib/mock/crm-queries";
import { ownerBookingStats } from "@/lib/mock/queries";

export default function OwnerStatsPage() {
  const stats = ownerBookingStats(DEMO_OWNER_ID);
  const series = ownerBookingSeries(DEMO_OWNER_ID);

  return (
    <PageShell
      title="Statistici"
      description="Rezervări, anulări și volum pe fiecare teren."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total rezervări" value={stats.total} index={0} />
        <KpiCard label="Confirmate" value={stats.confirmed} index={1} />
        <KpiCard label="Deschise" value={stats.open} index={2} />
        <KpiCard label="Anulate" value={stats.cancelled} index={3} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] p-5">
          <BarChart
            title="Rezervări pe teren"
            data={stats.byPitch.map(({ pitch, count }) => ({
              label: pitch.name,
              value: count,
            }))}
          />
        </section>
        <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] p-5">
          <TrendChart title="Rezervări pe zi" data={series} />
        </section>
      </div>
    </PageShell>
  );
}
