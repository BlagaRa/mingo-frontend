import type { Booking, BookingStatus, Pitch, User } from "./types";
import { bookings, pitches, users } from "./fixtures";
import { getPitch, getSlot, ownerPitches } from "./queries";
import { CRM_PAGE_SIZE, paginate, type PageResult } from "./paginate";

export function adminPlatformStats(): {
  users: number;
  pitches: number;
  bookings: number;
  byStatus: { status: BookingStatus; count: number }[];
  series: { label: string; value: number }[];
} {
  const statusOrder: BookingStatus[] = [
    "open",
    "full",
    "confirmed",
    "cancelled",
  ];
  const byStatus = statusOrder
    .map((status) => ({
      status,
      count: bookings.filter((b) => b.status === status).length,
    }))
    .filter((row) => row.count > 0);

  const byDay = new Map<string, number>();
  for (const booking of bookings) {
    const startsAt = getSlot(booking.slotId)?.startsAt;
    if (!startsAt) continue;
    const dayKey = startsAt.slice(0, 10);
    byDay.set(dayKey, (byDay.get(dayKey) ?? 0) + 1);
  }
  const series = [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([iso, value]) => ({
      label: new Intl.DateTimeFormat("ro-RO", {
        day: "numeric",
        month: "short",
      }).format(new Date(iso)),
      value,
    }));

  return {
    users: users.length,
    pitches: pitches.length,
    bookings: bookings.length,
    byStatus,
    series,
  };
}

export function filterUsers(
  list: User[],
  filters: { q?: string; role?: string; status?: string },
): User[] {
  return list.filter((user) => {
    if (filters.role && user.role !== filters.role) return false;
    if (filters.status) {
      const status = user.status ?? "active";
      if (status !== filters.status) return false;
    }
    if (filters.q) {
      const haystack = `${user.name} ${user.email}`.toLowerCase();
      if (!haystack.includes(filters.q.toLowerCase())) return false;
    }
    return true;
  });
}

export function filterBookings(
  list: Booking[],
  filters: { q?: string; status?: string },
): Booking[] {
  return list.filter((booking) => {
    if (filters.status && booking.status !== filters.status) return false;
    if (filters.q) {
      const pitchName = getPitch(booking.pitchId)?.name ?? "";
      if (!pitchName.toLowerCase().includes(filters.q.toLowerCase())) {
        return false;
      }
    }
    return true;
  });
}

export function filterAdminPitches(
  list: Pitch[],
  filters: { q?: string },
): Pitch[] {
  return list.filter((pitch) => {
    if (filters.q) {
      const haystack =
        `${pitch.name} ${pitch.oras} ${pitch.zona} ${pitch.judet}`.toLowerCase();
      if (!haystack.includes(filters.q.toLowerCase())) return false;
    }
    return true;
  });
}

export function ownerBookings(ownerId: string): Booking[] {
  const mine = new Set(ownerPitches(ownerId).map((pitch) => pitch.id));
  return bookings.filter((booking) => mine.has(booking.pitchId));
}

export function queryOwnerBookingsPage(
  ownerId: string,
  filters: { q?: string; status?: string; page?: string },
): PageResult<Booking> {
  const filtered = filterBookings(ownerBookings(ownerId), filters);
  return paginate(filtered, filters.page, CRM_PAGE_SIZE);
}

export function ownerBookingSeries(
  ownerId: string,
): { label: string; value: number }[] {
  const related = ownerBookings(ownerId);
  const byDay = new Map<string, number>();
  for (const booking of related) {
    const startsAt = getSlot(booking.slotId)?.startsAt;
    if (!startsAt) continue;
    const dayKey = startsAt.slice(0, 10);
    byDay.set(dayKey, (byDay.get(dayKey) ?? 0) + 1);
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([iso, value]) => ({
      label: new Intl.DateTimeFormat("ro-RO", {
        day: "numeric",
        month: "short",
      }).format(new Date(iso)),
      value,
    }));
}
