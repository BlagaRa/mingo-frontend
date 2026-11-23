import { bookings as fixtureBookings } from "./fixtures";
import {
  ensureOpenSlotsForDay,
  getSlot,
  slotsForPitchDay,
} from "./slot-store";
import type { Booking, Slot } from "./types";

let store: Booking[] = fixtureBookings.map((booking) => ({ ...booking }));

export function resetBookingStore(): void {
  store = fixtureBookings.map((booking) => ({ ...booking }));
}

export function listBookings(): Booking[] {
  return [...store];
}

export function getBooking(id: string): Booking | undefined {
  return store.find((booking) => booking.id === id);
}

export function upsertBooking(booking: Booking): void {
  const index = store.findIndex((existing) => existing.id === booking.id);
  if (index === -1) store.push(booking);
  else store[index] = booking;
}

function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/** Slots of the day not overlapping an active booking (1h windows). */
export function freeBookableHoursForDay(pitchId: string, day: string): Slot[] {
  const active = store.filter((b) => b.status !== "cancelled");
  const busy: Slot[] = [];
  for (const booking of active) {
    const slot = getSlot(booking.slotId);
    if (slot && slot.pitchId === pitchId) busy.push(slot);
  }

  ensureOpenSlotsForDay(pitchId, day);
  return slotsForPitchDay(pitchId, day).filter((candidate) => {
    if (active.some((b) => b.slotId === candidate.id)) return false;
    return !busy.some((taken) =>
      rangesOverlap(
        candidate.startsAt,
        candidate.endsAt,
        taken.startsAt,
        taken.endsAt,
      ),
    );
  });
}

export function confirmBooking(id: string): Booking | undefined {
  const booking = getBooking(id);
  if (booking?.status === "pending") booking.status = "open";
  return booking;
}
