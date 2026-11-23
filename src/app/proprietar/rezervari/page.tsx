"use client";

import { useState } from "react";
import { BookingContact } from "@/components/booking/booking-contact";
import { PageShell } from "@/components/layout/page-shell";
import { OwnerCreateBookingForm } from "@/components/owner/owner-create-booking-form";
import { OwnerMonthCalendar } from "@/components/owner/owner-month-calendar";
import { Button } from "@/components/ui/button";
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/feedback";
import { SelectField } from "@/components/ui/select-field";
import { StatusBadge } from "@/components/ui/status-badge";
import { listBookings, upsertBooking } from "@/lib/mock/booking-store";
import { DEMO_OWNER_ID } from "@/lib/mock/demo";
import { getPitch, getSlot, ownerPitches } from "@/lib/mock/queries";
import {
  formatDayLong,
  formatHour,
  shiftMonth,
  slotDay,
} from "@/lib/mock/schedule";
import type { Booking, BookingStatus } from "@/lib/mock/types";

function startsAt(booking: Booking): string {
  return getSlot(booking.slotId)?.startsAt ?? "";
}

export default function OwnerRezervariPage() {
  const mine = ownerPitches(DEMO_OWNER_ID);
  const mineIds = new Set(mine.map((pitch) => pitch.id));
  const [rows, setRows] = useState(listBookings);
  const [pitchId, setPitchId] = useState("");

  const visible = rows
    .filter((b) => mineIds.has(b.pitchId))
    .filter((b) => pitchId === "" || b.pitchId === pitchId)
    .sort((a, b) => startsAt(a).localeCompare(startsAt(b)));
  const daysWithBookings = new Set(visible.map((b) => slotDay(startsAt(b))));

  const [selectedDay, setSelectedDay] = useState(
    () => [...daysWithBookings].sort()[0] ?? "2026-11-24",
  );
  const [cursor, setCursor] = useState(() => ({
    year: Number(selectedDay.slice(0, 4)),
    month: Number(selectedDay.slice(5, 7)) - 1,
  }));

  const [creating, setCreating] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const formPitches = mine.filter((p) => pitchId === "" || p.id === pitchId);
  const dayBookings = visible.filter(
    (b) => slotDay(startsAt(b)) === selectedDay,
  );

  function setStatus(booking: Booking, status: BookingStatus) {
    upsertBooking({ ...booking, status });
    setRows(listBookings());
  }

  function actionsFor(booking: Booking): ActionMenuItem[] {
    const items: ActionMenuItem[] = [];
    if (
      booking.status === "pending" ||
      booking.status === "open" ||
      booking.status === "full"
    ) {
      items.push({
        id: "confirm",
        label: "Marchează încasată",
        onSelect: () => setStatus(booking, "confirmed"),
      });
    }
    if (booking.status !== "cancelled") {
      items.push({
        id: "cancel",
        label: "Anulează",
        danger: true,
        onSelect: () => setCancelTarget(booking),
      });
    }
    return items;
  }

  return (
    <PageShell
      title="Rezervări"
      description="Alege ziua, vezi rezervările și adaugă una nouă pe terenurile tale."
    >
      <div className="mb-6 max-w-sm">
        <SelectField
          label="Teren"
          size="sm"
          value={pitchId}
          emptyLabel="Toate terenurile"
          options={mine.map((pitch) => ({
            value: pitch.id,
            label: pitch.name,
          }))}
          onValueChange={setPitchId}
        />
      </div>

      <OwnerMonthCalendar
        year={cursor.year}
        month={cursor.month}
        selectedDay={selectedDay}
        daysWithBookings={daysWithBookings}
        onSelectDay={setSelectedDay}
        onShiftMonth={(delta) =>
          setCursor((c) => shiftMonth(c.year, c.month, delta))
        }
      />

      <section aria-labelledby="day-panel-title" className="mt-8">
        <h2
          id="day-panel-title"
          className="mb-4 font-display text-xl font-semibold capitalize tracking-tight text-[var(--color-ivory)]"
        >
          {formatDayLong(selectedDay)}
        </h2>
        {creating ? (
          <OwnerCreateBookingForm
            pitches={formPitches}
            day={selectedDay}
            onDone={() => {
              setCreating(false);
              setRows(listBookings());
            }}
          />
        ) : (
          <Button
            className="mb-4"
            variant="accent"
            onClick={() => setCreating(true)}
          >
            Rezervare nouă
          </Button>
        )}
        {dayBookings.length === 0 ? (
          <EmptyState title="Nicio rezervare în această zi" />
        ) : (
          <ul className="space-y-3">
            {dayBookings.map((booking) => {
              const items = actionsFor(booking);
              return (
                <li
                  key={booking.id}
                  data-testid="day-booking"
                  className="relative rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_12%,transparent)] bg-[var(--color-surface-muted)] p-4 pr-14"
                >
                  <div className="flex min-w-0 flex-col gap-2">
                    <p className="font-semibold tabular-nums text-[var(--color-ivory)]">
                      {formatHour(startsAt(booking))}
                    </p>
                    <p
                      data-testid="booking-pitch"
                      className="text-[var(--color-ivory)]"
                    >
                      {getPitch(booking.pitchId)?.name}
                    </p>
                    <StatusBadge status={booking.status} />
                    <BookingContact
                      email={booking.contactEmail}
                      phone={booking.contactPhone}
                    />
                  </div>
                  {items.length > 0 ? (
                    <div className="absolute right-3 top-3">
                      <ActionMenu items={items} />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Dialog
        open={Boolean(cancelTarget)}
        title={`Anulează · ${getPitch(cancelTarget?.pitchId ?? "")?.name ?? ""}`}
        description="Demo: statusul se schimbă doar în această sesiune."
        confirmLabel="Anulează"
        cancelLabel="Renunță"
        tone="danger"
        onClose={() => setCancelTarget(null)}
        onConfirm={() => {
          setStatus(cancelTarget!, "cancelled");
          setCancelTarget(null);
        }}
      />
    </PageShell>
  );
}
