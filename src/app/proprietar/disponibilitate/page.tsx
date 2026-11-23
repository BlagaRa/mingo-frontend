"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { OwnerMonthCalendar } from "@/components/owner/owner-month-calendar";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { SelectField } from "@/components/ui/select-field";
import { TimeField } from "@/components/ui/time-field";
import { theme } from "@/config/theme";
import { DEMO_OWNER_ID } from "@/lib/mock/demo";
import { buildSlotRange } from "@/lib/mock/hours";
import {
  closedDaysForPitch,
  getPitchProgram,
  isDayClosed,
  programHoursForPitch,
  setPitchProgram,
} from "@/lib/mock/program-store";
import { formatDayLong, shiftMonth } from "@/lib/mock/schedule";
import { listBookings } from "@/lib/mock/booking-store";
import { ownerPitches } from "@/lib/mock/queries";
import {
  getSlot,
  isStartOpen,
  setDayClosed,
  setStartOpen,
} from "@/lib/mock/slot-store";

function hourHasBooking(pitchId: string, day: string, hour: string): boolean {
  if (!isStartOpen(pitchId, day, hour)) return false;
  const { startsAt } = buildSlotRange(day, hour);
  return listBookings().some((booking) => {
    if (booking.status === "cancelled" || booking.pitchId !== pitchId) {
      return false;
    }
    return getSlot(booking.slotId)?.startsAt === startsAt;
  });
}

function AvailabilityEditor() {
  const params = useSearchParams();
  const mine = ownerPitches(DEMO_OWNER_ID);
  const pitchFromQuery = params.get("pitch") ?? "";
  const initialPitch =
    mine.find((p) => p.id === pitchFromQuery)?.id ?? mine[0]?.id ?? "";

  const [pitchId, setPitchId] = useState(initialPitch);
  const [cursor, setCursor] = useState({ year: 2026, month: 11 });
  const [selectedDay, setSelectedDay] = useState("2026-12-10");
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState("");

  const refresh = () => setVersion((v) => v + 1);

  const program = useMemo(() => {
    void version;
    return pitchId
      ? getPitchProgram(pitchId)
      : { startHour: "08:00", endHour: "20:30" };
  }, [pitchId, version]);

  const hours = useMemo(() => {
    void version;
    return pitchId ? programHoursForPitch(pitchId) : [];
  }, [pitchId, version]);

  const closedDays = useMemo(() => {
    void version;
    return pitchId ? closedDaysForPitch(pitchId) : new Set<string>();
  }, [pitchId, version]);

  const dayClosed = pitchId ? isDayClosed(pitchId, selectedDay) : false;

  if (mine.length === 0) {
    return (
      <PageShell
        title="Disponibilitate"
        description="Setezi programul terenului — zilele sunt deschise, tu închizi excepțiile."
      >
        <EmptyState
          title="Adaugă un teren întâi"
          description="Fără terenuri nu poți seta programul."
          action={
            <Button asChild variant="accent">
              <Link href="/proprietar/terenuri/nou">Adaugă teren</Link>
            </Button>
          }
        />
      </PageShell>
    );
  }

  function toggleHour(hour: string) {
    if (!pitchId) return;
    const nextOpen = !isStartOpen(pitchId, selectedDay, hour);
    const result = setStartOpen(pitchId, selectedDay, hour, nextOpen);
    if (!result.ok) {
      setMessage(result.reason ?? "Nu am putut schimba ora.");
      return;
    }
    setMessage("");
    refresh();
  }

  function toggleDay() {
    if (!pitchId) return;
    const result = setDayClosed(pitchId, selectedDay, !dayClosed);
    if (result.skipped) {
      setMessage(
        `Zi închisă, dar ${result.skipped} ore cu rezervări au rămas deschise.`,
      );
    } else {
      setMessage("");
    }
    refresh();
  }

  return (
    <PageShell
      title="Disponibilitate"
      description="Programul zilei e deschis automat. Închizi o zi întreagă sau doar anumite ore."
    >
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="min-w-[10rem] max-w-[14rem] flex-1">
          <SelectField
            label="Teren"
            size="sm"
            value={pitchId}
            options={mine.map((pitch) => ({
              value: pitch.id,
              label: pitch.name,
            }))}
            onValueChange={setPitchId}
          />
        </div>
        <TimeField
          label="De la"
          value={program.startHour}
          onCommit={(startHour) => {
            if (!pitchId) return;
            const end =
              startHour <= program.endHour ? program.endHour : startHour;
            setPitchProgram(pitchId, startHour, end);
            refresh();
          }}
        />
        <TimeField
          label="Până la"
          value={program.endHour}
          onCommit={(endHour) => {
            if (!pitchId) return;
            const start =
              endHour >= program.startHour ? program.startHour : endHour;
            setPitchProgram(pitchId, start, endHour);
            refresh();
          }}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <OwnerMonthCalendar
          year={cursor.year}
          month={cursor.month}
          selectedDay={selectedDay}
          daysWithBookings={closedDays}
          onSelectDay={setSelectedDay}
          onShiftMonth={(delta) =>
            setCursor((c) => shiftMonth(c.year, c.month, delta))
          }
        />

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--color-ivory)]">
                {formatDayLong(selectedDay)}
              </h2>
              <p className="mt-1 text-sm opacity-70">
                Start la :00 / :30 · slot de 1 oră
              </p>
            </div>
            <Button
              type="button"
              variant={dayClosed ? "ghost" : "accent"}
              onClick={toggleDay}
            >
              {dayClosed ? "Azi închis" : "Azi deschis"}
            </Button>
          </div>

          {message ? (
            <p className="text-sm" role="status">
              {message}
            </p>
          ) : null}

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {hours.map((hour) => {
              const on = isStartOpen(pitchId, selectedDay, hour);
              const booked = hourHasBooking(pitchId, selectedDay, hour);
              return (
                <button
                  key={hour}
                  type="button"
                  disabled={booked && on}
                  onClick={() => toggleHour(hour)}
                  className="rounded-[var(--radius-sm)] border px-2 py-3 text-sm font-semibold tabular-nums transition-[transform,background-color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97] disabled:opacity-60"
                  style={{
                    backgroundColor: on
                      ? theme.colors.ivory
                      : theme.colors.coral,
                    color: on ? theme.colors.forest : theme.colors.onCoral,
                    borderColor: on
                      ? theme.colors.ivory
                      : theme.colors.coral,
                  }}
                  aria-label={`${hour}${booked ? ", rezervat" : on ? ", liber" : ", închis"}`}
                >
                  {hour}
                  <span className="mt-1 block text-[0.65rem] font-medium opacity-80">
                    {booked ? "rezervat" : on ? "liber" : "închis"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default function OwnerAvailabilityPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[var(--content-max)] px-[var(--page-gutter)] py-14">
          <Skeleton label="Se încarcă disponibilitatea" lines={6} />
        </div>
      }
    >
      <AvailabilityEditor />
    </Suspense>
  );
}
