"use client";

import { useState } from "react";
import { theme } from "@/config/theme";
import {
  CalendarShift,
  useCalSlide,
  useDaySquash,
} from "@/components/ui/calendar-motion";
import {
  buildMonthCells,
  formatDayLong,
  formatMonthTitle,
  WEEKDAY_LABELS,
  type MonthCell,
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
  "flex h-10 w-10 items-center justify-center rounded-full text-xl font-semibold transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] enabled:hover:bg-[color-mix(in_srgb,var(--color-forest)_8%,transparent)] enabled:active:scale-[0.96] disabled:opacity-25";

function OwnerDayGrid({
  cells,
  selectedDay,
  daysWithBookings,
  squashClass,
  squashWrapKey,
  onPick,
  onSquashEnd,
}: {
  cells: MonthCell[];
  selectedDay: string;
  daysWithBookings: Set<string>;
  squashClass: (day: string) => string;
  squashWrapKey: (day: string) => string;
  onPick: (day: string) => void;
  onSquashEnd: (day: string) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-1 overflow-visible py-1">
      {cells.map((cell) => {
        if (!cell.day) {
          return <div key={cell.key} className="h-11 sm:h-12" />;
        }
        const day = cell.day;
        const selected = day === selectedDay;
        const marked = daysWithBookings.has(day);
        const squashing = Boolean(squashClass(day));
        return (
          <div
            key={squashWrapKey(day)}
            className="flex justify-center overflow-visible"
          >
            <button
              type="button"
              aria-label={`${formatDayLong(day)}${marked ? ", cu rezervări" : ""}`}
              aria-pressed={selected}
              onClick={() => onPick(day)}
              onAnimationEnd={() => {
                if (squashing) onSquashEnd(day);
              }}
              className={`relative mx-auto flex h-11 w-11 items-center justify-center rounded-full text-[0.95rem] font-semibold tabular-nums transition-[background-color,color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] sm:h-12 sm:w-12 sm:text-base ${squashClass(day)}`}
              style={{
                backgroundColor: selected
                  ? theme.colors.coral
                  : marked
                    ? theme.colors.forestFill
                    : "transparent",
                color: selected
                  ? theme.colors.onCoral
                  : marked
                    ? theme.colors.ivory
                    : theme.colors.forest,
              }}
            >
              {cell.label}
              {marked ? (
                <span
                  data-testid="booking-dot"
                  aria-hidden
                  className="absolute bottom-1.5 h-1 w-1 rounded-full"
                  style={{
                    backgroundColor: selected
                      ? theme.colors.onCoral
                      : theme.colors.coral,
                  }}
                />
              ) : null}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function OwnerMonthCalendar({
  year,
  month,
  selectedDay,
  daysWithBookings,
  onSelectDay,
  onShiftMonth,
}: OwnerMonthCalendarProps) {
  const [outgoing, setOutgoing] = useState<{
    year: number;
    month: number;
  } | null>(null);
  const { slide, beginSlide, endSlide } = useCalSlide();
  const { triggerSquash, endSquash, squashClass, squashWrapKey } =
    useDaySquash();

  const cells = buildMonthCells(year, month, new Set());
  const outgoingCells = outgoing
    ? buildMonthCells(outgoing.year, outgoing.month, new Set())
    : null;

  function moveMonth(delta: -1 | 1) {
    setOutgoing({ year, month });
    beginSlide(delta > 0 ? "next" : "prev");
    onShiftMonth(delta);
  }

  function pickDay(day: string) {
    triggerSquash(day);
    onSelectDay(day);
  }

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
          onClick={() => moveMonth(-1)}
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
          onClick={() => moveMonth(1)}
          className={navButtonClass}
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

      <CalendarShift
        slide={slide}
        onSlideEnd={() => {
          setOutgoing(null);
          endSlide();
        }}
        current={
          <OwnerDayGrid
            cells={cells}
            selectedDay={selectedDay}
            daysWithBookings={daysWithBookings}
            squashClass={squashClass}
            squashWrapKey={squashWrapKey}
            onPick={pickDay}
            onSquashEnd={endSquash}
          />
        }
        outgoing={
          outgoingCells ? (
            <OwnerDayGrid
              cells={outgoingCells}
              selectedDay={selectedDay}
              daysWithBookings={daysWithBookings}
              squashClass={squashClass}
              squashWrapKey={squashWrapKey}
              onPick={pickDay}
              onSquashEnd={endSquash}
            />
          ) : undefined
        }
      />
    </div>
  );
}
