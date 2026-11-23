import { listBookings } from "./booking-store";
import { slots as fixtureSlots } from "./fixtures";
import { buildSlotRange } from "./hours";
import {
  clearDayHourClosures,
  isProgramStartOpen,
  programHoursForPitch,
  setDayClosedFlag,
  setHourClosed,
} from "./program-store";
import type { Slot } from "./types";

let store: Slot[] = fixtureSlots.map((slot) => ({ ...slot }));

function slotDay(iso: string): string {
  return iso.slice(0, 10);
}

export function resetSlotStore(): void {
  store = fixtureSlots.map((slot) => ({ ...slot }));
}

export function listSlots(): Slot[] {
  return [...store];
}

export function getSlot(id: string): Slot | undefined {
  return store.find((slot) => slot.id === id);
}

export function slotsForPitch(pitchId: string): Slot[] {
  return store.filter((slot) => slot.pitchId === pitchId);
}

export function slotsForPitchDay(pitchId: string, day: string): Slot[] {
  return store
    .filter((slot) => slot.pitchId === pitchId && slotDay(slot.startsAt) === day)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

function findStartSlot(
  pitchId: string,
  day: string,
  startHour: string,
): Slot | undefined {
  const { startsAt } = buildSlotRange(day, startHour);
  return store.find(
    (slot) => slot.pitchId === pitchId && slot.startsAt === startsAt,
  );
}

export function isStartOpen(
  pitchId: string,
  day: string,
  startHour: string,
): boolean {
  return isProgramStartOpen(pitchId, day, startHour);
}

function hasActiveBooking(slotId: string): boolean {
  return listBookings().some(
    (booking) => booking.slotId === slotId && booking.status !== "cancelled",
  );
}

function hasActiveBookingOnStart(
  pitchId: string,
  day: string,
  startHour: string,
): boolean {
  const existing = findStartSlot(pitchId, day, startHour);
  return existing ? hasActiveBooking(existing.id) : false;
}

function materializeStart(
  pitchId: string,
  day: string,
  startHour: string,
): void {
  if (findStartSlot(pitchId, day, startHour)) return;
  const { startsAt, endsAt } = buildSlotRange(day, startHour);
  store.push({
    id: `slot-${pitchId}-${day}-${startHour.replace(":", "")}`,
    pitchId,
    startsAt,
    endsAt,
  });
}

function removeStartIfFree(
  pitchId: string,
  day: string,
  startHour: string,
): boolean {
  const existing = findStartSlot(pitchId, day, startHour);
  if (!existing) return true;
  if (hasActiveBooking(existing.id)) return false;
  store = store.filter((slot) => slot.id !== existing.id);
  return true;
}

/** Ensure material slots exist for every currently open start that day. */
export function ensureOpenSlotsForDay(pitchId: string, day: string): void {
  for (const hour of programHoursForPitch(pitchId)) {
    if (isStartOpen(pitchId, day, hour)) materializeStart(pitchId, day, hour);
    else removeStartIfFree(pitchId, day, hour);
  }
}

export function setStartOpen(
  pitchId: string,
  day: string,
  startHour: string,
  open: boolean,
): { ok: boolean; reason?: string } {
  if (open) {
    setHourClosed(pitchId, day, startHour, false);
    if (isStartOpen(pitchId, day, startHour)) {
      materializeStart(pitchId, day, startHour);
    }
    return { ok: true };
  }
  if (hasActiveBookingOnStart(pitchId, day, startHour)) {
    return { ok: false, reason: "Are o rezervare activă pe ora asta." };
  }
  setHourClosed(pitchId, day, startHour, true);
  removeStartIfFree(pitchId, day, startHour);
  return { ok: true };
}

export function setDayClosed(
  pitchId: string,
  day: string,
  closed: boolean,
): { ok: boolean; skipped: number } {
  if (!closed) {
    setDayClosedFlag(pitchId, day, false);
    clearDayHourClosures(pitchId, day);
    ensureOpenSlotsForDay(pitchId, day);
    return { ok: true, skipped: 0 };
  }
  let skipped = 0;
  for (const hour of programHoursForPitch(pitchId)) {
    const result = setStartOpen(pitchId, day, hour, false);
    if (!result.ok) skipped += 1;
  }
  setDayClosedFlag(pitchId, day, true);
  return { ok: true, skipped };
}

export function openAllStarts(pitchId: string, day: string): void {
  setDayClosed(pitchId, day, false);
}

export function closeDay(
  pitchId: string,
  day: string,
): { closed: number; skipped: number } {
  const before = programHoursForPitch(pitchId).filter((h) =>
    isStartOpen(pitchId, day, h),
  ).length;
  const result = setDayClosed(pitchId, day, true);
  return { closed: Math.max(0, before - result.skipped), skipped: result.skipped };
}

export function eachDayInclusive(fromDay: string, toDay: string): string[] {
  const start = new Date(`${fromDay}T12:00:00`);
  const end = new Date(`${toDay}T12:00:00`);
  if (end < start) return eachDayInclusive(toDay, fromDay);
  const days: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    days.push(`${y}-${m}-${day}`);
  }
  return days;
}

export function closeDayRange(
  pitchId: string,
  fromDay: string,
  toDay: string,
): { daysTouched: number; closed: number; skipped: number } {
  const days = eachDayInclusive(fromDay, toDay);
  let closed = 0;
  let skipped = 0;
  for (const day of days) {
    const result = closeDay(pitchId, day);
    closed += result.closed;
    skipped += result.skipped;
  }
  return { daysTouched: days.length, closed, skipped };
}

export function daysWithOpenHours(pitchId: string): Set<string> {
  return new Set(
    store
      .filter((slot) => slot.pitchId === pitchId)
      .map((slot) => slotDay(slot.startsAt)),
  );
}

export function setHourClosedSafe(
  pitchId: string,
  day: string,
  startHour: string,
  closed: boolean,
): { ok: boolean; reason?: string } {
  return setStartOpen(pitchId, day, startHour, !closed);
}
