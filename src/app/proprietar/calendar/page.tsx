"use client";

import { useState } from "react";
import { BookingContact } from "@/components/booking/booking-contact";
import { PageShell } from "@/components/layout/page-shell";
import { OwnerCreateBookingForm } from "@/components/owner/owner-create-booking-form";
import { OwnerMonthCalendar } from "@/components/owner/owner-month-calendar";
import { Button } from "@/components/ui/button";
import { ActionMenu, type ActionMenuItem } from "@/components/ui/action-menu";
import { EmptyState } from "@/components/ui/feedback";
import { StatusBadge } from "@/components/ui/status-badge";
import { listBookings, upsertBooking } from "@/lib/mock/booking-store";
import { DEMO_OWNER_ID } from "@/lib/mock/demo";
import { getPitch, getSlot, ownerPitches } from "@/lib/mock/queries";
import { formatDayLong, formatHour, shiftMonth, slotDay } from "@/lib/mock/schedule";
import type { Booking, BookingStatus } from "@/lib/mock/types";

function startsAt(booking: Booking): string {
  return getSlot(booking.slotId)?.startsAt ?? "";
}

export default function OwnerCalendarPage() {
  const mine = ownerPitches(DEMO_OWNER_ID);
  const mineIds = new Set(mine.map((pitch) => pitch.id));
  const [rows, setRows] = useState(listBookings);
  const [pitchId, setPitchId] = useState("all");

  const visible = rows
    .filter((b) => mineIds.has(b.pitchId))
    .filter((b) => pitchId === "all" || b.pitchId === pitchId)
    .sort((a, b) => startsAt(a).localeCompare(startsAt(b)));
  const daysWithBookings = new Set(visible.map((b) => slotDay(startsAt(b))));

  const [selectedDay, setSelectedDay] = useState(
    () => [...daysWithBookings].sort()[0]!,
  );
  const [cursor, setCursor] = useState(() => ({
    year: Number(selectedDay.slice(0, 4)),
    month: Number(selectedDay.slice(5, 7)) - 1,
  }));

  const [creating, setCreating] = useState(false);
  const formPitches = mine.filter((p) => pitchId === "all" || p.id === pitchId);
  const dayBookings = visible.filter((b) => slotDay(startsAt(b)) === selectedDay);

  function setStatus(booking: Booking, status: BookingStatus) {
    upsertBooking({ ...booking, status });
    setRows(listBookings());
  }

  function actionsFor(booking: Booking): ActionMenuItem[] {
    const items: ActionMenuItem[] = [];
    if (booking.status === "pending" || booking.status === "open") {
      items.push({
        id: "confirm",
        label: "Confirmă",
        onSelect: () => setStatus(booking, "confirmed"),
      });
    }
    if (booking.status !== "cancelled") {
      items.push({
        id: "cancel",
        label: "Anulează",
        danger: true,
        onSelect: () => setStatus(booking, "cancelled"),
      });
    }
    return items;
  }

  return (
    <PageShell
      title="Calendar rezervări"
      description="Alege o zi ca să vezi rezervările pe toate terenurile sau pe unul singur."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={pitchId === "all" ? "primary" : "ghost"}
          onClick={() => setPitchId("all")}
        >
          Toate terenurile
        </Button>
        {mine.map((pitch) => (
          <Button
            key={pitch.id}
            variant={pitchId === pitch.id ? "accent" : "ghost"}
            onClick={() => setPitchId(pitch.id)}
          >
            {pitch.name}
          </Button>
        ))}
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
          className="mb-4 font-display text-xl font-semibold capitalize tracking-tight text-[var(--color-forest)]"
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
          <Button className="mb-4" variant="accent" onClick={() => setCreating(true)}>
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
                  className="flex flex-wrap items-start justify-between gap-4 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] bg-[var(--color-ivory)] p-4"
                >
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold tabular-nums text-[var(--color-forest)]">
                      {formatHour(startsAt(booking))}
                    </p>
                    <p
                      data-testid="booking-pitch"
                      className="text-[var(--color-forest)]"
                    >
                      {getPitch(booking.pitchId)?.name}
                    </p>
                    <StatusBadge status={booking.status} />
                  </div>
                  <BookingContact
                    email={booking.contactEmail}
                    phone={booking.contactPhone}
                  />
                  {items.length > 0 ? <ActionMenu items={items} /> : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
