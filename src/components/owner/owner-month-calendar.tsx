"use client";

import { theme } from "@/config/theme";
import {
  buildMonthCells,
  formatDayLong,
  formatMonthTitle,
  WEEKDAY_LABELS,
} from "@/lib/mock/schedule";

type OwnerMonthCalendarProps = {
  year: number;
  month: number;
  selectedDay: string;
  daysWithBookings: Set<string>;
  onSelectDay: (day: string) => void;
  onShiftMonth: (delta: number) => void;
};

const navButtonClass =
  "flex h-10 w-10 items-center justify-center rounded-full text-xl font-semibold transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] hover:bg-[color-mix(in_srgb,var(--color-forest)_8%,transparent)] active:scale-[0.96]";

export function OwnerMonthCalendar({
  year,
  month,
  selectedDay,
  daysWithBookings,
  onSelectDay,
  onShiftMonth,
}: OwnerMonthCalendarProps) {
  const cells = buildMonthCells(year, month, new Set());

  return (
    <div
      className="w-full rounded-[var(--radius-md)] px-4 py-6 sm:px-8 sm:py-8"
      style={{
        backgroundColor: theme.colors.ivory,
        boxShadow: "inset 0 0 0 1px color-mix(in srgb, #073035 12%, transparent)",
      }}
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          type="button"
          aria-label="Luna anterioară"
          onClick={() => onShiftMonth(-1)}
          className={navButtonClass}
          style={{ color: theme.colors.forest }}
        >
          ‹
        </button>
        <h2 className="font-display text-xl font-semibold capitalize tracking-tight text-[var(--color-forest)] sm:text-2xl">
          {formatMonthTitle(year, month)}
        </h2>
        <button
          type="button"
          aria-label="Luna următoare"
          onClick={() => onShiftMonth(1)}
          className={navButtonClass}
          style={{ color: theme.colors.forest }}
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-forest-fill)]">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          if (!cell.day) {
            return <div key={cell.key} className="h-11 sm:h-12" />;
          }
          const day = cell.day;
          const selected = day === selectedDay;
          const marked = daysWithBookings.has(day);
          return (
            <button
              key={cell.key}
              type="button"
              aria-label={`${formatDayLong(day)}${marked ? ", cu rezervări" : ""}`}
              aria-pressed={selected}
              onClick={() => onSelectDay(day)}
              className="relative mx-auto flex h-11 w-11 items-center justify-center rounded-full text-[0.95rem] font-semibold tabular-nums transition-[transform,background-color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.96] sm:h-12 sm:w-12 sm:text-base"
              style={{
                backgroundColor: selected
                  ? theme.colors.coral
                  : marked
                    ? theme.colors.coralSoft
                    : "transparent",
                color: theme.colors.forest,
              }}
            >
              {cell.label}
              {marked ? (
                <span
                  data-testid="booking-dot"
                  aria-hidden
                  className="absolute bottom-1.5 h-1 w-1 rounded-full"
                  style={{ backgroundColor: theme.colors.forest }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
