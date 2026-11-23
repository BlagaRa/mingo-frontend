"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/feedback";
import { theme } from "@/config/theme";
import {
  buildWeekDays,
  formatDayLong,
  formatHour,
  formatWeekTitle,
  freeHoursForDay,
  mondayOfWeek,
  pickInitialDay,
  shiftWeek,
  todayISO,
  WEEKDAY_LABELS,
} from "@/lib/mock/schedule";

export function PitchWeekHours({
  pitchId,
  availableDays,
}: {
  pitchId: string;
  availableDays: string[];
}) {
  const available = useMemo(() => new Set(availableDays), [availableDays]);
  const initialDay = pickInitialDay(availableDays, todayISO());
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [weekMonday, setWeekMonday] = useState(() =>
    mondayOfWeek(initialDay || todayISO()),
  );

  const weekDays = buildWeekDays(weekMonday);
  const hours = selectedDay ? freeHoursForDay(pitchId, selectedDay) : [];

  const canGoPrev = availableDays.some((day) => day < weekMonday);
  const weekEnd = weekDays[6] ?? weekMonday;
  const canGoNext = availableDays.some((day) => day > weekEnd);

  if (availableDays.length === 0) {
    return (
      <EmptyState
        title="Nicio oră liberă"
        description="Proprietarul nu a deschis încă intervale pe acest teren."
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Săptămâna anterioară"
          disabled={!canGoPrev}
          onClick={() => setWeekMonday(shiftWeek(weekMonday, -1))}
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] enabled:active:scale-[0.96] disabled:opacity-25"
          style={{ color: theme.colors.ivory }}
        >
          ‹
        </button>
        <p className="font-display text-sm font-semibold capitalize tracking-tight text-[var(--color-ivory)] sm:text-base">
          {formatWeekTitle(weekMonday)}
        </p>
        <button
          type="button"
          aria-label="Săptămâna următoare"
          disabled={!canGoNext}
          onClick={() => setWeekMonday(shiftWeek(weekMonday, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] enabled:active:scale-[0.96] disabled:opacity-25"
          style={{ color: theme.colors.ivory }}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, index) => {
          const selectable = available.has(day);
          const selected = day === selectedDay;
          const dayNumber = Number(day.slice(8, 10));
          return (
            <div key={day} className="flex flex-col items-center gap-1">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-coral)]">
                {WEEKDAY_LABELS[index]}
              </span>
              <button
                type="button"
                disabled={!selectable}
                aria-label={
                  selectable ? `Alege ${day}` : `${day} indisponibil`
                }
                aria-pressed={selected}
                onClick={() => setSelectedDay(day)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold tabular-nums transition-[transform,background-color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] enabled:active:scale-[0.96] disabled:cursor-not-allowed sm:h-11 sm:w-11"
                style={{
                  backgroundColor: selected
                    ? theme.colors.coral
                    : selectable
                      ? theme.colors.coralSoft
                      : "transparent",
                  color: selectable
                    ? selected
                      ? theme.colors.onCoral
                      : theme.colors.ivory
                    : "color-mix(in srgb, var(--color-ivory) 32%, transparent)",
                }}
              >
                {dayNumber}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-5" aria-live="polite">
        {selectedDay ? (
          <>
            <p className="text-sm font-semibold text-[var(--color-ivory)]">
              {formatDayLong(selectedDay)}
            </p>
            {hours.length === 0 ? (
              <EmptyState
                className="mt-3"
                title="Nicio oră liberă"
                description="Ziua e în săptămână, dar nu are ore deschise. Alege altă zi."
              />
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {hours.map((slot) => (
                  <Link
                    key={slot.id}
                    href={`/rezervari/nou?pitchId=${pitchId}&slotId=${slot.id}`}
                    className="rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-ivory)_16%,transparent)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm font-semibold tabular-nums transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
                  >
                    {formatHour(slot.startsAt)}
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
