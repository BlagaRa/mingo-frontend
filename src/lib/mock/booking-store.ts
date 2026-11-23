import { bookings as fixtureBookings } from "./fixtures";
import type { Booking } from "./types";

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

export function confirmBooking(id: string): Booking | undefined {
  const booking = getBooking(id);
  if (booking?.status === "pending") booking.status = "open";
  return booking;
}
