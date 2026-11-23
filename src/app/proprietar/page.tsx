import Link from "next/link";
import { ActivityList } from "@/components/crm/activity-list";
import { BarChart } from "@/components/crm/bar-chart";
import { KpiCard } from "@/components/crm/kpi-card";
import { TrendChart } from "@/components/crm/trend-chart";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { bookingStatusLabel } from "@/lib/mock/booking-display";
import { DEMO_OWNER_ID } from "@/lib/mock/demo";
import {
  ownerBookingSeries,
  ownerBookings,
} from "@/lib/mock/crm-queries";
import {
  bookingsSortedByStartsAt,
  formatDateTime,
  getPitch,
  getSlot,
  ownerBookingStats,
  ownerPitches,
} from "@/lib/mock/queries";

export default function ProprietarPage() {
  const mine = ownerPitches(DEMO_OWNER_ID);
  const stats = ownerBookingStats(DEMO_OWNER_ID);
  const series = ownerBookingSeries(DEMO_OWNER_ID);
  const recent = bookingsSortedByStartsAt(ownerBookings(DEMO_OWNER_ID))
    .slice()
    .reverse()
    .slice(0, 5)
    .map((booking) => {
      const pitch = getPitch(booking.pitchId);
      const slot = getSlot(booking.slotId);
      return {
        id: booking.id,
        title: pitch?.name ?? booking.pitchId,
        meta: `${slot ? formatDateTime(slot.startsAt) : "—"} · ${bookingStatusLabel(booking.status)}`,
        href: `/proprietar/rezervari`,
      };
    });

  return (
    <PageShell
      title="Panou proprietar"
      description="KPI-uri, trenduri și rezervările tale recente."
      actions={
        <Button asChild variant="accent">
          <Link href="/proprietar/terenuri/nou">Adaugă teren</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Terenuri" value={mine.length} href="/proprietar/terenuri" index={0} />
        <KpiCard
          label="Zone"
          value={new Set(mine.map((p) => p.zona)).size}
          index={1}
        />
        <KpiCard
          label="Rezervări"
          value={stats.total}
          href="/proprietar/rezervari"
          index={2}
        />
        <KpiCard label="Anulate" value={stats.cancelled} index={3} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_14%,transparent)] p-5">
          <BarChart
            title="Rezervări pe status"
            data={[
              { label: "Confirmate", value: stats.confirmed },
              { label: "Deschise", value: stats.open },
              { label: "Complete", value: stats.full },
              { label: "Anulate", value: stats.cancelled },
            ].filter((row) => row.value > 0)}
          />
        </section>
        <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_14%,transparent)] p-5">
          <TrendChart title="Rezervări pe zi" data={series} />
        </section>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold text-[var(--color-forest)]">
          Activitate recentă
        </h2>
        <ActivityList items={recent} />
      </section>
    </PageShell>
  );
}
