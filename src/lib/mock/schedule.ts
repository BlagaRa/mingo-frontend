import type { Slot } from "./types";
import { listSlots } from "./slot-store";

export { OWNER_START_HOURS, buildSlotRange } from "./hours";
export { OWNER_START_HOURS as OWNER_HOURS } from "./hours";

export type MonthCell = {
  key: string;
  day: string | null;
  label: string;
  inMonth: boolean;
  selectable: boolean;
};

/** YYYY-MM-DD in local-ish ISO date from slot */
export function slotDay(iso: string): string {
  return iso.slice(0, 10);
}

export function formatHour(iso: string): string {
  return new Intl.DateTimeFormat("ro-RO", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDayLabel(day: string): string {
  return new Intl.DateTimeFormat("ro-RO", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${day}T12:00:00`));
}

export function formatDayLong(day: string): string {
  return new Intl.DateTimeFormat("ro-RO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${day}T12:00:00`));
}

export function formatMonthTitle(year: number, month: number): string {
  return new Intl.DateTimeFormat("ro-RO", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
}

export function shiftMonth(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  const date = new Date(year, month + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

function padDay(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/** Monday-start month grid. All in-month days are labeled; only available ones are selectable. */
export function buildMonthCells(
  year: number,
  month: number,
  available: Set<string>,
): MonthCell[] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mondayIndex = (first.getDay() + 6) % 7;
  const cells: MonthCell[] = [];

  for (let i = 0; i < 42; i++) {
    const dayNumber = i - mondayIndex + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      cells.push({
        key: `pad-${i}`,
        day: null,
        label: "",
        inMonth: false,
        selectable: false,
      });
      continue;
    }
    const day = padDay(year, month, dayNumber);
    cells.push({
      key: day,
      day,
      label: String(dayNumber),
      inMonth: true,
      selectable: available.has(day),
    });
  }

  return cells;
}

export function availableDays(pitchId: string): string[] {
  const days = [
    ...new Set(
      listSlots()
        .filter((slot) => slot.pitchId === pitchId)
        .map((slot) => slotDay(slot.startsAt)),
    ),
  ];
  return days.sort();
}

export function freeHoursForDay(pitchId: string, day: string): Slot[] {
  return listSlots()
    .filter(
      (slot) => slot.pitchId === pitchId && slotDay(slot.startsAt) === day,
    )
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function hourKey(pitchId: string, day: string, hour: string): string {
  return `${pitchId}|${day}|${hour}`;
}

export const WEEKDAY_LABELS = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"] as const;

export function todayISO(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function mondayOfWeek(day: string): string {
  const date = new Date(`${day}T12:00:00`);
  const offset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - offset);
  return todayISO(date);
}

export function buildWeekDays(anchorDay: string): string[] {
  const monday = mondayOfWeek(anchorDay);
  const start = new Date(`${monday}T12:00:00`);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return todayISO(date);
  });
}

export function shiftWeek(monday: string, deltaWeeks: number): string {
  const date = new Date(`${monday}T12:00:00`);
  date.setDate(date.getDate() + deltaWeeks * 7);
  return todayISO(date);
}

export function pickInitialDay(
  available: string[],
  today: string,
): string {
  if (available.includes(today)) return today;
  return available[0] ?? "";
}

export function formatWeekTitle(monday: string): string {
  const days = buildWeekDays(monday);
  const start = new Date(`${days[0]}T12:00:00`);
  const end = new Date(`${days[6]}T12:00:00`);
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: sameMonth ? undefined : "short",
  }).format(start);
  const endLabel = new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(end);
  return `${startLabel} – ${endLabel}`;
}
