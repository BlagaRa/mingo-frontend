import type { Booking, Pitch } from "./types";
import { bookings, pitches, slots, users } from "./fixtures";

export type PitchFilters = {
  judet?: string;
  oras?: string;
  zona?: string;
  q?: string;
  surface?: string;
  covered?: string;
  nightLights?: string;
  indoor?: string;
  minCapacity?: string;
};

export const PITCH_PAGE_SIZE = 6;

export type PitchPageResult = {
  items: Pitch[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export function filterPitches(
  list: Pitch[],
  filters: PitchFilters,
): Pitch[] {
  return list.filter((pitch) => {
    if (filters.judet && pitch.judet !== filters.judet) return false;
    if (filters.oras && pitch.oras !== filters.oras) return false;
    if (filters.zona && pitch.zona !== filters.zona) return false;
    if (filters.surface && pitch.surface !== filters.surface) return false;
    if (filters.covered === "1" && !pitch.covered) return false;
    if (filters.nightLights === "1" && !pitch.nightLights) return false;
    if (filters.indoor === "1" && !pitch.indoor) return false;
    if (filters.minCapacity) {
      const min = Number.parseInt(filters.minCapacity, 10);
      if (Number.isFinite(min) && pitch.capacity < min) return false;
    }
    if (filters.q) {
      const haystack = `${pitch.name} ${pitch.zona} ${pitch.oras}`.toLowerCase();
      if (!haystack.includes(filters.q.toLowerCase())) return false;
    }
    return true;
  });
}

/** Server-side pitch listing: filter first, then paginate. */
export function queryPitchesPage(
  filters: PitchFilters & { page?: string },
  pageSize: number = PITCH_PAGE_SIZE,
): PitchPageResult {
  const filtered = filterPitches(pitches, filters);
  const total = filtered.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const requested = Number.parseInt(filters.page ?? "1", 10);
  const page = Number.isFinite(requested) && requested > 0 ? requested : 1;
  const safePage =
    totalPages === 0 ? 1 : Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    total,
    totalPages,
  };
}

export function bookingPriceRon(pitch: Pitch): number {
  return pitch.pricePerHourRon;
}

export function formatRon(amount: number): string {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function openSeats(booking: Booking): number {
  return Math.max(0, booking.seatsNeeded - booking.playerIds.length);
}

export function uniqueLocations(list: Pitch[]) {
  const judete = [...new Set(list.map((pitch) => pitch.judet))].sort();
  const oraseByJudet: Record<string, string[]> = {};
  const zoneByOras: Record<string, string[]> = {};

  for (const pitch of list) {
    oraseByJudet[pitch.judet] ??= [];
    if (!oraseByJudet[pitch.judet].includes(pitch.oras)) {
      oraseByJudet[pitch.judet].push(pitch.oras);
    }
    zoneByOras[pitch.oras] ??= [];
    if (!zoneByOras[pitch.oras].includes(pitch.zona)) {
      zoneByOras[pitch.oras].push(pitch.zona);
    }
  }

  for (const key of Object.keys(oraseByJudet)) oraseByJudet[key].sort();
  for (const key of Object.keys(zoneByOras)) zoneByOras[key].sort();

  return { judete, oraseByJudet, zoneByOras };
}

export function getPitch(id: string) {
  return pitches.find((pitch) => pitch.id === id);
}

export function getBooking(id: string) {
  return bookings.find((booking) => booking.id === id);
}

export function getSlot(id: string) {
  return slots.find((slot) => slot.id === id);
}

export function getUser(id: string) {
  return users.find((user) => user.id === id);
}

export function slotsForPitch(pitchId: string) {
  return slots.filter((slot) => slot.pitchId === pitchId);
}

export function bookingsForPitch(pitchId: string) {
  return bookings.filter((booking) => booking.pitchId === pitchId);
}

export function bookingsSortedByStartsAt(list: Booking[]): Booking[] {
  return [...list].sort((a, b) => {
    const aStart = getSlot(a.slotId)?.startsAt ?? "";
    const bStart = getSlot(b.slotId)?.startsAt ?? "";
    return aStart.localeCompare(bStart);
  });
}

export function ownerPitches(ownerId: string) {
  return pitches.filter((pitch) => pitch.ownerId === ownerId);
}

export function ownerBookingStats(ownerId: string) {
  const mine = new Set(ownerPitches(ownerId).map((pitch) => pitch.id));
  const related = bookings.filter((booking) => mine.has(booking.pitchId));
  return {
    total: related.length,
    confirmed: related.filter((b) => b.status === "confirmed").length,
    cancelled: related.filter((b) => b.status === "cancelled").length,
    open: related.filter((b) => b.status === "open").length,
    full: related.filter((b) => b.status === "full").length,
    byPitch: ownerPitches(ownerId).map((pitch) => ({
      pitch,
      count: related.filter((b) => b.pitchId === pitch.id).length,
    })),
  };
}

export { pitches, bookings, slots, users };
