import Link from "next/link";
import { CrmPagination } from "@/components/crm/crm-pagination";
import { CrmToolbar } from "@/components/crm/crm-toolbar";
import { DataTable } from "@/components/crm/data-table";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/feedback";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  BOOKING_STATUS_FILTERS,
  bookingSeatsLabel,
  bookingStatusLabel,
} from "@/lib/mock/booking-display";
import { filterBookings } from "@/lib/mock/crm-queries";
import { paginate } from "@/lib/mock/paginate";
import {
  bookings,
  bookingsSortedByStartsAt,
  formatDateTime,
  getPitch,
  getSlot,
} from "@/lib/mock/queries";

type Search = { q?: string; status?: string; page?: string };

export default async function AdminRezervariPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const filters = await searchParams;
  const filtered = filterBookings(bookingsSortedByStartsAt(bookings), {
    q: filters.q,
    status: filters.status,
  });
  const result = paginate(filtered, filters.page);

  return (
    <PageShell
      title="Rezervări"
      description="Status, locuri rămase și legături către detalii."
    >
      <CrmToolbar
        resultCount={result.total}
        searchDefault={filters.q ?? ""}
        action="/admin/rezervari"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Status</span>
          <select
            name="status"
            defaultValue={filters.status ?? ""}
            className="rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-ivory)_16%,transparent)] bg-transparent px-3 py-2"
          >
            <option value="">Toate</option>
            {BOOKING_STATUS_FILTERS.map((status) => (
              <option key={status} value={status}>
                {bookingStatusLabel(status)}
              </option>
            ))}
          </select>
        </label>
      </CrmToolbar>

      <DataTable
        columns={["Teren", "Interval", "Status", "Locuri"]}
        empty={
          <EmptyState
            title="Nicio rezervare pe filtrele astea"
            description="Schimbă statusul sau căutarea."
          />
        }
      >
        {result.items.length === 0
          ? null
          : result.items.map((booking) => {
              const pitch = getPitch(booking.pitchId);
              const slot = getSlot(booking.slotId);
              return (
                <tr
                  key={booking.id}
                  className="border-t border-[color-mix(in_srgb,var(--color-ivory)_10%,transparent)]"
                >
                  <td data-label="Teren" className="px-4 py-3">
                    <Link
                      href={`/rezervari/${booking.id}`}
                      className="underline-offset-2 hover:underline"
                    >
                      {pitch?.name ?? booking.pitchId}
                    </Link>
                  </td>
                  <td data-label="Interval" className="px-4 py-3">
                    {slot ? formatDateTime(slot.startsAt) : "—"}
                  </td>
                  <td data-label="Status" className="px-4 py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td data-label="Locuri" className="px-4 py-3 tabular-nums">
                    {bookingSeatsLabel(booking)}
                  </td>
                </tr>
              );
            })}
      </DataTable>

      <CrmPagination
        basePath="/admin/rezervari"
        page={result.page}
        totalPages={result.totalPages}
        filters={{ q: filters.q, status: filters.status }}
      />
    </PageShell>
  );
}
