import { theme } from "@/config/theme";
import type { Booking, BookingStatus } from "./types";

const labels: Record<BookingStatus, string> = {
  open: "Deschisă",
  /** Team filled seats — not the same as paid/settled. */
  full: "Locuri pline",
  /** Owner marked paid / settled. */
  confirmed: "Încasată",
  cancelled: "Anulată",
  pending: "Neconfirmată",
};

export const BOOKING_STATUS_FILTERS: BookingStatus[] = [
  "open",
  "full",
  "confirmed",
  "cancelled",
  "pending",
];

export type BookingListFilters = {
  status?: string;
  pitchId?: string;
};

export function filterBookings(
  list: Booking[],
  filters: BookingListFilters,
): Booking[] {
  return list.filter((booking) => {
    if (filters.status && booking.status !== filters.status) return false;
    if (filters.pitchId && booking.pitchId !== filters.pitchId) return false;
    return true;
  });
}

export function bookingStatusLabel(status: BookingStatus): string {
  return labels[status];
}

export function bookingSeatsLabel(booking: Booking): string {
  return `${booking.playerIds.length}/${booking.seatsNeeded}`;
}

export function bookingStatusTone(status: BookingStatus): {
  backgroundColor: string;
  color: string;
} {
  switch (status) {
    case "open":
      return {
        backgroundColor: theme.colors.statusOpen,
        color: theme.colors.forest,
      };
    case "full":
      return {
        backgroundColor: theme.colors.forestFill,
        color: theme.colors.ivory,
      };
    case "confirmed":
      return {
        backgroundColor: theme.colors.surfaceMuted,
        color: theme.colors.ivory,
      };
    case "cancelled":
      return {
        backgroundColor: theme.colors.statusDanger,
        color: theme.colors.forest,
      };
    case "pending":
      return {
        backgroundColor: theme.colors.coralSoft,
        color: theme.colors.ivory,
      };
  }
}
