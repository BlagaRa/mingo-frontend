"use client";

import { useMemo, useState } from "react";
import {
  buildMonthCells,
  formatMonthTitle,
  shiftMonth,
  WEEKDAY_LABELS,
  type MonthCell,
} from "@/lib/mock/schedule";
import { theme } from "@/config/theme";
import {
  CalendarShift,
  useCalSlide,
  useDaySquash,
} from "@/components/ui/calendar-motion";

function MonthDayGrid({
  cells,
  selectedDay,
  squashClass,
  squashWrapKey,
  onPick,
  onSquashEnd,
}: {
  cells: MonthCell[];
  selectedDay: string;
  squashClass: (day: string) => string;
  squashWrapKey: (day: string) => string;
  onPick: (day: string) => void;
  onSquashEnd: (day: string) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-1 overflow-visible py-1">
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

        const day = cell.day;
        const selected = day === selectedDay;
        const squashing = Boolean(squashClass(day));
        return (
          <div
            key={squashWrapKey(day)}
            className="flex justify-center overflow-visible"
          >
            <button
              type="button"
              aria-label={`Alege ${day}`}
              aria-pressed={selected}
              onClick={() => onPick(day)}
              onAnimationEnd={() => {
                if (squashing) onSquashEnd(day);
              }}
              className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full text-[0.95rem] font-semibold tabular-nums transition-[background-color,color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] sm:h-12 sm:w-12 sm:text-base ${squashClass(day)}`}
              style={{
                backgroundColor: selected
                  ? theme.colors.coral
                  : theme.colors.forestFill,
                color: selected ? theme.colors.onCoral : theme.colors.ivory,
              }}
            >
              {cell.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}

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
  const [outgoing, setOutgoing] = useState<{
    year: number;
    month: number;
  } | null>(null);
  const { slide, beginSlide, endSlide } = useCalSlide();
  const { triggerSquash, endSquash, squashClass, squashWrapKey } =
    useDaySquash();

  const cells = buildMonthCells(cursor.year, cursor.month, available);
  const outgoingCells = outgoing
    ? buildMonthCells(outgoing.year, outgoing.month, available)
    : null;

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

  function moveMonth(delta: -1 | 1) {
    setOutgoing({ year: cursor.year, month: cursor.month });
    beginSlide(delta > 0 ? "next" : "prev");
    setCursor(shiftMonth(cursor.year, cursor.month, delta));
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
      aria-label="Calendar disponibilitate"
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          type="button"
          aria-label="Luna anterioară"
          disabled={!canGoPrev}
          onClick={() => moveMonth(-1)}
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
          onClick={() => moveMonth(1)}
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

      <CalendarShift
        slide={slide}
        onSlideEnd={() => {
          setOutgoing(null);
          endSlide();
        }}
        current={
          <MonthDayGrid
            cells={cells}
            selectedDay={selectedDay}
            squashClass={squashClass}
            squashWrapKey={squashWrapKey}
            onPick={pickDay}
            onSquashEnd={endSquash}
          />
        }
        outgoing={
          outgoingCells ? (
            <MonthDayGrid
              cells={outgoingCells}
              selectedDay={selectedDay}
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
