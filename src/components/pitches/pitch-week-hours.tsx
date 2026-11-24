"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarShift,
  useCalSlide,
  useDaySquash,
} from "@/components/ui/calendar-motion";
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

function WeekDayRow({
  days,
  available,
  selectedDay,
  squashClass,
  squashWrapKey,
  onSelectDay,
  onSquashEnd,
}: {
  days: string[];
  available: Set<string>;
  selectedDay: string;
  squashClass: (day: string) => string;
  squashWrapKey: (day: string) => string;
  onSelectDay: (day: string) => void;
  onSquashEnd: (day: string) => void;
}) {
  return (
    <div className="grid grid-cols-7 gap-1 overflow-visible py-1">
      {days.map((day) => {
        const selectable = available.has(day);
        const selected = day === selectedDay;
        const squashing = Boolean(squashClass(day));
        const dayNumber = Number(day.slice(8, 10));
        return (
          <div
            key={squashWrapKey(day)}
            className="flex justify-center overflow-visible"
          >
            <button
              type="button"
              disabled={!selectable}
              aria-label={selectable ? `Alege ${day}` : `${day} indisponibil`}
              aria-pressed={selected}
              onClick={() => onSelectDay(day)}
              onAnimationEnd={() => {
                if (squashing) onSquashEnd(day);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold tabular-nums transition-[background-color,color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] disabled:cursor-not-allowed sm:h-11 sm:w-11 ${squashClass(day)}`}
              style={{
                backgroundColor: selected
                  ? theme.colors.coral
                  : selectable
                    ? theme.colors.forestFill
                    : "transparent",
                color: selectable
                  ? selected
                    ? theme.colors.onCoral
                    : theme.colors.ivory
                  : "color-mix(in srgb, var(--color-forest) 42%, transparent)",
              }}
            >
              {dayNumber}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function PitchWeekHours({
  pitchId,
  availableDays,
  selectedSlotId = "",
  onSelectSlot,
}: {
  pitchId: string;
  availableDays: string[];
  selectedSlotId?: string;
  /** When set, hours stay on-page instead of navigating away */
  onSelectSlot?: (slotId: string, day: string) => void;
}) {
  const available = useMemo(() => new Set(availableDays), [availableDays]);
  const initialDay = pickInitialDay(availableDays, todayISO());
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [weekMonday, setWeekMonday] = useState(() =>
    mondayOfWeek(initialDay || todayISO()),
  );
  const [outgoingMonday, setOutgoingMonday] = useState<string | null>(null);
  const { slide, beginSlide, endSlide } = useCalSlide();
  const { triggerSquash, endSquash, squashClass, squashWrapKey } =
    useDaySquash();

  const weekDays = buildWeekDays(weekMonday);
  const outgoingDays = outgoingMonday ? buildWeekDays(outgoingMonday) : null;
  const hours = selectedDay ? freeHoursForDay(pitchId, selectedDay) : [];

  const canGoPrev = availableDays.some((day) => day < weekMonday);
  const weekEnd = weekDays[6] ?? weekMonday;
  const canGoNext = availableDays.some((day) => day > weekEnd);

  function moveWeek(delta: -1 | 1) {
    setOutgoingMonday(weekMonday);
    beginSlide(delta > 0 ? "next" : "prev");
    setWeekMonday(shiftWeek(weekMonday, delta));
  }

  function selectDay(day: string) {
    triggerSquash(day);
    setSelectedDay(day);
  }

  if (availableDays.length === 0) {
    return (
      <EmptyState
        tone="light"
        title="Nicio oră liberă"
        description="Proprietarul nu a deschis încă intervale pe acest teren."
      />
    );
  }

  const gridProps = {
    available,
    selectedDay,
    squashClass,
    squashWrapKey,
    onSelectDay: selectDay,
    onSquashEnd: endSquash,
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Săptămâna anterioară"
          disabled={!canGoPrev}
          onClick={() => moveWeek(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] enabled:hover:bg-[color-mix(in_srgb,var(--color-forest)_8%,transparent)] enabled:active:scale-[0.96] disabled:opacity-25"
          style={{ color: theme.colors.forest }}
        >
          ‹
        </button>
        <p className="font-display text-sm font-semibold capitalize tracking-tight text-[var(--color-forest)] sm:text-base">
          {formatWeekTitle(weekMonday)}
        </p>
        <button
          type="button"
          aria-label="Săptămâna următoare"
          disabled={!canGoNext}
          onClick={() => moveWeek(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] enabled:hover:bg-[color-mix(in_srgb,var(--color-forest)_8%,transparent)] enabled:active:scale-[0.96] disabled:opacity-25"
          style={{ color: theme.colors.forest }}
        >
          ›
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-forest)] opacity-55"
          >
            {label}
          </div>
        ))}
      </div>

      <CalendarShift
        slide={slide}
        onSlideEnd={() => {
          setOutgoingMonday(null);
          endSlide();
        }}
        current={<WeekDayRow days={weekDays} {...gridProps} />}
        outgoing={
          outgoingDays ? (
            <WeekDayRow days={outgoingDays} {...gridProps} />
          ) : undefined
        }
      />

      <div className="mt-5" aria-live="polite">
        {selectedDay ? (
          <>
            <p className="text-sm font-semibold text-[var(--color-forest)]">
              {formatDayLong(selectedDay)}
            </p>
            {hours.length === 0 ? (
              <EmptyState
                tone="light"
                className="mt-3"
                title="Nicio oră liberă"
                description="Ziua e în săptămână, dar nu are ore deschise. Alege altă zi."
              />
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {hours.map((slot) => {
                  const label = formatHour(slot.startsAt);
                  const active = slot.id === selectedSlotId;
                  const style = {
                    backgroundColor: active
                      ? theme.colors.coral
                      : theme.colors.ivory,
                    color: active ? theme.colors.onCoral : theme.colors.forest,
                    boxShadow: active
                      ? undefined
                      : "inset 0 0 0 1px color-mix(in srgb, var(--color-forest-fill) 28%, transparent)",
                  } as const;

                  if (onSelectSlot) {
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        aria-label={`Alege ${label}`}
                        aria-pressed={active}
                        onClick={() => onSelectSlot(slot.id, selectedDay)}
                        className="rounded-[var(--radius-sm)] px-3.5 py-2.5 text-sm font-semibold tabular-nums transition-[transform,background-color,color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
                        style={style}
                      >
                        {label}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={slot.id}
                      href={`/rezervari/nou?pitchId=${pitchId}&slotId=${slot.id}`}
                      aria-label={`Rezervă ${label}`}
                      className="rounded-[var(--radius-sm)] px-3.5 py-2.5 text-sm font-semibold tabular-nums transition-[transform,background-color,color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
                      style={style}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
