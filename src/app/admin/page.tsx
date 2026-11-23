import { ActivityList } from "@/components/crm/activity-list";
import { BarChart } from "@/components/crm/bar-chart";
import { KpiCard } from "@/components/crm/kpi-card";
import { TrendChart } from "@/components/crm/trend-chart";
import { PageShell } from "@/components/layout/page-shell";
import { adminPlatformStats } from "@/lib/mock/crm-queries";
import { bookingStatusLabel } from "@/lib/mock/booking-display";
import {
  bookings,
  bookingsSortedByStartsAt,
  formatDateTime,
  getPitch,
  getSlot,
} from "@/lib/mock/queries";

export default function AdminPage() {
  const stats = adminPlatformStats();
  const recent = bookingsSortedByStartsAt(bookings)
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
        href: `/rezervari/${booking.id}`,
      };
    });

  return (
    <PageShell
      title="Admin"
      description="Privire de ansamblu — KPI-uri, trenduri și activitate recentă."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Membri"
          value={stats.users}
          href="/admin/membri"
          index={0}
        />
        <KpiCard
          label="Terenuri"
          value={stats.pitches}
          href="/admin/terenuri"
          index={1}
        />
        <KpiCard
          label="Rezervări"
          value={stats.bookings}
          href="/admin/rezervari"
          index={2}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_14%,transparent)] p-5">
          <BarChart
            title="Rezervări pe status"
            data={stats.byStatus.map((row) => ({
              label: bookingStatusLabel(row.status),
              value: row.count,
            }))}
          />
        </section>
        <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_14%,transparent)] p-5">
          <TrendChart title="Rezervări pe zi" data={stats.series} />
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
