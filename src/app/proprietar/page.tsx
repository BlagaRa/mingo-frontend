import Link from "next/link";
import { ActivityList } from "@/components/crm/activity-list";
import { BarChart } from "@/components/crm/bar-chart";
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
  const toCollect = stats.pending + stats.open;
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
        meta: slot ? formatDateTime(slot.startsAt) : "—",
        statusLabel: bookingStatusLabel(booking.status),
        href: `/proprietar/rezervari`,
      };
    });

  return (
    <PageShell
      title="Panou"
      description="Ce așteaptă încasare, ce e plin și ce se mișcă pe terenurile tale."
      actions={
        <Button asChild variant="accent">
          <Link href="/proprietar/terenuri/nou">Adaugă teren</Link>
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 border-b border-[color-mix(in_srgb,var(--color-ivory)_12%,transparent)] pb-6 lg:grid-cols-4 lg:gap-x-8">
        <Link
          href="/proprietar/rezervari"
          className="rounded-[var(--radius-md)] transition-colors duration-[var(--motion-press-ms)] ease-[var(--ease-out)] focus-visible:outline-offset-4 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[color-mix(in_srgb,var(--color-ivory)_4%,transparent)]"
        >
          <p className="text-sm opacity-70">De încasat</p>
          <p className="mt-1 font-display text-3xl font-semibold tabular-nums text-[var(--color-ivory)]">
            {toCollect}
          </p>
          <p className="mt-1 text-sm opacity-60">
            Neconfirmate / deschise — încă nu ai marcat banii.
          </p>
        </Link>
        <div>
          <p className="text-sm opacity-70">Locuri pline</p>
          <p className="mt-1 font-display text-3xl font-semibold tabular-nums text-[var(--color-ivory)]">
            {stats.full}
          </p>
          <p className="mt-1 text-sm opacity-60">
            Echipă completă, nu neapărat încasat.
          </p>
        </div>
        <div>
          <p className="text-sm opacity-70">Încasate</p>
          <p className="mt-1 font-display text-3xl font-semibold tabular-nums text-[var(--color-ivory)]">
            {stats.confirmed}
          </p>
          <p className="mt-1 text-sm opacity-60">Banii marcați ca primiți.</p>
        </div>
        <Link
          href="/proprietar/terenuri"
          className="rounded-[var(--radius-md)] transition-colors duration-[var(--motion-press-ms)] ease-[var(--ease-out)] focus-visible:outline-offset-4 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[color-mix(in_srgb,var(--color-ivory)_4%,transparent)]"
        >
          <p className="text-sm opacity-70">Terenuri</p>
          <p className="mt-1 font-display text-3xl font-semibold tabular-nums text-[var(--color-ivory)]">
            {mine.length}
          </p>
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] p-5">
          <BarChart
            title="Rezervări pe status"
            data={[
              { label: "Încasate", value: stats.confirmed },
              { label: "Deschise", value: stats.open },
              { label: "Locuri pline", value: stats.full },
              { label: "Neconfirmate", value: stats.pending },
              { label: "Anulate", value: stats.cancelled },
            ].filter((row) => row.value > 0)}
          />
        </section>
        <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] p-5">
          <TrendChart title="Rezervări pe zi" data={series} />
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-[var(--color-ivory)]">
            Activitate recentă
          </h2>
          <Link
            href="/proprietar/rezervari"
            className="text-sm font-semibold underline-offset-2 hover:underline"
          >
            Toate
          </Link>
        </div>
        <ActivityList items={recent} />
      </section>
    </PageShell>
  );
}
