"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CrmPagination } from "@/components/crm/crm-pagination";
import { CrmToolbar } from "@/components/crm/crm-toolbar";
import { DataTable } from "@/components/crm/data-table";
import { PageShell } from "@/components/layout/page-shell";
import { BookingContact } from "@/components/booking/booking-contact";
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  BOOKING_STATUS_FILTERS,
  bookingSeatsLabel,
  bookingStatusLabel,
} from "@/lib/mock/booking-display";
import { DEMO_OWNER_ID } from "@/lib/mock/demo";
import { listBookings, upsertBooking } from "@/lib/mock/booking-store";
import { filterBookings } from "@/lib/mock/crm-queries";
import { paginate } from "@/lib/mock/paginate";
import {
  bookingsSortedByStartsAt,
  formatDateTime,
  getPitch,
  getSlot,
  ownerPitches,
} from "@/lib/mock/queries";
import type { Booking } from "@/lib/mock/types";

function ownerRows(): Booking[] {
  const mine = new Set(ownerPitches(DEMO_OWNER_ID).map((pitch) => pitch.id));
  return bookingsSortedByStartsAt(
    listBookings().filter((booking) => mine.has(booking.pitchId)),
  );
}

function OwnerRezervariClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const page = searchParams.get("page") ?? undefined;

  const [rows, setRows] = useState<Booking[]>(ownerRows);
  const [target, setTarget] = useState<{
    booking: Booking;
    action: "confirm" | "cancel";
  } | null>(null);

  const filtered = useMemo(
    () => filterBookings(rows, { q, status }),
    [rows, q, status],
  );
  const result = paginate(filtered, page);

  function actionsFor(booking: Booking): ActionMenuItem[] {
    const items: ActionMenuItem[] = [];
    if (booking.status !== "confirmed" && booking.status !== "cancelled") {
      items.push({
        id: "confirm",
        label: "Confirmă",
        onSelect: () => setTarget({ booking, action: "confirm" }),
      });
    }
    if (booking.status !== "cancelled") {
      items.push({
        id: "cancel",
        label: "Anulează",
        danger: true,
        onSelect: () => setTarget({ booking, action: "cancel" }),
      });
    }
    return items;
  }

  return (
    <PageShell
      title="Rezervări"
      description="Confirmă sau anulează rezervările pe terenurile tale (demo)."
    >
      <CrmToolbar
        resultCount={result.total}
        searchDefault={q ?? ""}
        action="/proprietar/rezervari"
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Status</span>
          <select
            name="status"
            defaultValue={status ?? ""}
            className="rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-forest)_16%,transparent)] bg-transparent px-3 py-2"
          >
            <option value="">Toate</option>
            {BOOKING_STATUS_FILTERS.map((value) => (
              <option key={value} value={value}>
                {bookingStatusLabel(value)}
              </option>
            ))}
          </select>
        </label>
      </CrmToolbar>

      <DataTable
        columns={["Teren", "Interval", "Status", "Locuri", "Contact", "Acțiuni"]}
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
              const items = actionsFor(booking);
              return (
                <tr
                  key={booking.id}
                  className="border-t border-[color-mix(in_srgb,var(--color-forest)_10%,transparent)]"
                >
                  <td className="px-4 py-3 font-medium">
                    {pitch?.name ?? booking.pitchId}
                  </td>
                  <td className="px-4 py-3">
                    {slot ? formatDateTime(slot.startsAt) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {bookingSeatsLabel(booking)}
                  </td>
                  <td className="px-4 py-3">
                    <BookingContact
                      email={booking.contactEmail}
                      phone={booking.contactPhone}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {items.length > 0 ? <ActionMenu items={items} /> : null}
                  </td>
                </tr>
              );
            })}
      </DataTable>

      <CrmPagination
        basePath="/proprietar/rezervari"
        page={result.page}
        totalPages={result.totalPages}
        filters={{ q, status }}
      />

      <Dialog
        open={Boolean(target)}
        title={
          target
            ? `${target.action === "confirm" ? "Confirmă" : "Anulează"} · ${getPitch(target.booking.pitchId)?.name ?? target.booking.pitchId}`
            : "Rezervare"
        }
        description={
          target
            ? `Demo: ${getSlot(target.booking.slotId) ? formatDateTime(getSlot(target.booking.slotId)!.startsAt) : "—"} — statusul se schimbă doar în această sesiune.`
            : undefined
        }
        confirmLabel={target?.action === "confirm" ? "Confirmă" : "Anulează"}
        cancelLabel="Renunță"
        tone={target?.action === "cancel" ? "danger" : "default"}
        onClose={() => setTarget(null)}
        onConfirm={() => {
          if (!target) return;
          const nextStatus =
            target.action === "confirm" ? "confirmed" : "cancelled";
          upsertBooking({ ...target.booking, status: nextStatus });
          setRows(ownerRows());
          setTarget(null);
        }}
      />
    </PageShell>
  );
}

export default function OwnerRezervariPage() {
  return (
    <Suspense fallback={<Skeleton label="Se încarcă rezervările" lines={6} />}>
      <OwnerRezervariClient />
    </Suspense>
  );
}
