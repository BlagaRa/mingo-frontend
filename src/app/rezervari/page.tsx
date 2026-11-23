import Link from "next/link";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { BookingFilters } from "@/components/booking/booking-filters";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  bookingSeatsLabel,
  filterBookings,
} from "@/lib/mock/booking-display";
import {
  bookings,
  bookingsSortedByStartsAt,
  formatDateTime,
  getPitch,
  getSlot,
} from "@/lib/mock/queries";
import { theme } from "@/config/theme";

type Search = {
  status?: string;
  pitchId?: string;
};

export default async function RezervariPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const filters = await searchParams;
  const sorted = bookingsSortedByStartsAt(bookings);
  const rows = filterBookings(sorted, filters);
  const hasFilters = Boolean(filters.status || filters.pitchId);
  const emptyAll = sorted.length === 0;

  return (
    <PageShell
      title="Rezervările mele"
      description="Gestionează rezervările din tabel."
      actions={
        <Button asChild variant="accent">
          <Link href="/rezervari/nou">Rezervă acum</Link>
        </Button>
      }
    >
      {!emptyAll ? (
        <Suspense
          fallback={
            <div className="mb-5">
              <Skeleton label="Se încarcă filtrele" lines={2} />
            </div>
          }
        >
          <BookingFilters />
        </Suspense>
      ) : null}

      {rows.length === 0 ? (
        <EmptyState
          title={
            emptyAll
              ? "Nicio rezervare încă"
              : hasFilters
                ? "Nicio rezervare pe filtrele astea"
                : "Nicio rezervare încă"
          }
          description={
            emptyAll
              ? "Alege un teren, o zi liberă și o oră — rezervarea apare aici."
              : hasFilters
                ? "Schimbă statusul, terenul sau resetează filtrele."
                : "Alege un teren, o zi liberă și o oră — rezervarea apare aici."
          }
          action={
            emptyAll ? (
              <Button asChild variant="accent">
                <Link href="/rezervari/nou">Rezervă acum</Link>
              </Button>
            ) : hasFilters ? (
              <Button asChild variant="accent">
                <Link href="/rezervari">Resetează filtrele</Link>
              </Button>
            ) : (
              <Button asChild variant="accent">
                <Link href="/rezervari/nou">Rezervă acum</Link>
              </Button>
            )
          }
        />
      ) : (
        <div className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] bg-[var(--color-surface-muted)] shadow-[0_10px_24px_color-mix(in_srgb,var(--color-ivory)_8%,transparent)] md:overflow-x-auto">
          <table className="mingo-data-table min-w-full text-left text-sm">
            <thead style={{ backgroundColor: theme.colors.surfaceMuted }}>
              <tr>
                <th className="px-4 py-3 font-semibold">Teren</th>
                <th className="px-4 py-3 font-semibold">Dată</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Locuri</th>
                <th className="px-4 py-3 font-semibold"> </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((booking) => {
                const pitch = getPitch(booking.pitchId);
                const slot = getSlot(booking.slotId);
                return (
                  <tr
                    key={booking.id}
                    className="border-t border-[color-mix(in_srgb,var(--color-ivory)_10%,transparent)]"
                  >
                    <td
                      data-label="Teren"
                      className="px-4 py-3 font-medium text-[var(--color-ivory)]"
                    >
                      {pitch?.name ?? booking.pitchId}
                    </td>
                    <td data-label="Dată" className="px-4 py-3 tabular-nums">
                      {slot ? formatDateTime(slot.startsAt) : "—"}
                    </td>
                    <td data-label="Status" className="px-4 py-3">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td data-label="Locuri" className="px-4 py-3 tabular-nums">
                      {bookingSeatsLabel(booking)}
                    </td>
                    <td data-label="" className="px-4 py-3 text-right">
                      <Button asChild variant="ghost">
                        <Link href={`/rezervari/${booking.id}`}>Deschide</Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}
