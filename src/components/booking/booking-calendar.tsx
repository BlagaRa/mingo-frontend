"use client";

import { useMemo, useState } from "react";
import {
  buildMonthCells,
  formatMonthTitle,
  shiftMonth,
  WEEKDAY_LABELS,
} from "@/lib/mock/schedule";
import { theme } from "@/config/theme";

export function BookingCalendar({
  availableDays,
  selectedDay,
  onSelectDay,
}: {
  availableDays: string[];
  selectedDay: string;
  onSelectDay: (day: string) => void;
}) {
  const available = useMemo(() => new Set(availableDays), [availableDays]);
  const firstAvailable = availableDays[0];
  const initial = firstAvailable
    ? {
        year: Number(firstAvailable.slice(0, 4)),
        month: Number(firstAvailable.slice(5, 7)) - 1,
      }
    : { year: 2026, month: 10 };

  const [cursor, setCursor] = useState(initial);
  const cells = buildMonthCells(cursor.year, cursor.month, available);

  const canGoPrev = availableDays.some((day) => {
    const y = Number(day.slice(0, 4));
    const m = Number(day.slice(5, 7)) - 1;
    return y < cursor.year || (y === cursor.year && m < cursor.month);
  });
  const canGoNext = availableDays.some((day) => {
    const y = Number(day.slice(0, 4));
    const m = Number(day.slice(5, 7)) - 1;
    return y > cursor.year || (y === cursor.year && m > cursor.month);
  });

  return (
    <div
      className="w-full rounded-[var(--radius-md)] px-4 py-6 sm:px-8 sm:py-8"
      style={{
        backgroundColor: theme.colors.ivory,
        boxShadow: "inset 0 0 0 1px color-mix(in srgb, #073035 12%, transparent)",
      }}
      aria-label="Calendar disponibilitate"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          type="button"
          aria-label="Luna anterioară"
          disabled={!canGoPrev}
          onClick={() => setCursor(shiftMonth(cursor.year, cursor.month, -1))}
          className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-semibold transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] enabled:hover:bg-[color-mix(in_srgb,var(--color-forest)_8%,transparent)] enabled:active:scale-[0.96] disabled:opacity-25"
          style={{ color: theme.colors.forest }}
        >
          ‹
        </button>
        <h2 className="font-display text-xl font-semibold capitalize tracking-tight text-[var(--color-forest)] sm:text-2xl">
          {formatMonthTitle(cursor.year, cursor.month)}
        </h2>
        <button
          type="button"
          aria-label="Luna următoare"
          disabled={!canGoNext}
          onClick={() => setCursor(shiftMonth(cursor.year, cursor.month, 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-semibold transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] enabled:hover:bg-[color-mix(in_srgb,var(--color-forest)_8%,transparent)] enabled:active:scale-[0.96] disabled:opacity-25"
          style={{ color: theme.colors.forest }}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-forest)] opacity-55">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          if (!cell.inMonth || !cell.day) {
            return <div key={cell.key} className="h-11 sm:h-12" />;
          }

          if (!cell.selectable) {
            return (
              <button
                key={cell.key}
                type="button"
                disabled
                aria-label={`${cell.day} indisponibil`}
                className="mx-auto flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-full text-[0.95rem] font-medium tabular-nums sm:h-12 sm:w-12 sm:text-base"
                style={{
                  color: "color-mix(in srgb, var(--color-forest) 42%, transparent)",
                }}
              >
                {cell.label}
              </button>
            );
          }

          const selected = cell.day === selectedDay;
          return (
            <button
              key={cell.key}
              type="button"
              aria-label={`Alege ${cell.day}`}
              aria-pressed={selected}
              onClick={() => onSelectDay(cell.day!)}
              className="mx-auto flex h-11 w-11 items-center justify-center rounded-full text-[0.95rem] font-semibold tabular-nums transition-[transform,background-color,color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.96] sm:h-12 sm:w-12 sm:text-base"
              style={{
                backgroundColor: selected
                  ? theme.colors.forest
                  : theme.colors.coral,
                color: selected ? theme.colors.ivory : theme.colors.onCoral,
              }}
            >
              {cell.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
