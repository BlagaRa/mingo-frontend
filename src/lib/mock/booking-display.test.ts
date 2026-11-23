import { describe, expect, it } from "vitest";
import { theme } from "@/config/theme";
import type { Booking } from "./types";
import {
  BOOKING_STATUS_FILTERS,
  bookingSeatsLabel,
  bookingStatusLabel,
  bookingStatusTone,
  filterBookings,
} from "./booking-display";
import { bookings } from "./fixtures";

function booking(partial: Partial<Booking>): Booking {
  return {
    id: "b",
    pitchId: "p",
    slotId: "s",
    hostId: "h",
    playerIds: ["u1", "u2"],
    status: "open",
    seatsNeeded: 10,
    contactName: "Andrei Pop",
    contactEmail: "andrei@example.com",
    contactPhone: "0721123456",
    ...partial,
  };
}

describe("booking display", () => {
  it("formats seats as occupied/total for every status", () => {
    expect(bookingSeatsLabel(booking({ status: "open", playerIds: ["a", "b"], seatsNeeded: 10 }))).toBe(
      "2/10",
    );
    expect(
      bookingSeatsLabel(
        booking({
          status: "full",
          playerIds: Array.from({ length: 14 }, (_, i) => `u${i}`),
          seatsNeeded: 14,
        }),
      ),
    ).toBe("14/14");
    expect(
      bookingSeatsLabel(
        booking({ status: "cancelled", playerIds: ["a"], seatsNeeded: 10 }),
      ),
    ).toBe("1/10");
  });

  it("labels statuses in Romanian", () => {
    expect(bookingStatusLabel("open")).toBe("Deschisă");
    expect(bookingStatusLabel("full")).toBe("Locuri pline");
    expect(bookingStatusLabel("confirmed")).toBe("Încasată");
    expect(bookingStatusLabel("cancelled")).toBe("Anulată");
    expect(bookingStatusLabel("pending")).toBe("Neconfirmată");
  });

  it("offers pending in the status filters", () => {
    expect(BOOKING_STATUS_FILTERS).toContain("pending");
  });

  it("uses a coral-soft tone for pending, distinct from cancelled and confirmed", () => {
    const pending = bookingStatusTone("pending");
    expect(pending.backgroundColor).toBe(theme.colors.coralSoft);
    expect(pending.color).toBe(theme.colors.ivory);
    expect(pending.backgroundColor).not.toBe(
      bookingStatusTone("cancelled").backgroundColor,
    );
    expect(pending.backgroundColor).not.toBe(
      bookingStatusTone("confirmed").backgroundColor,
    );
  });

  it("gives every fixture booking a contact name, email and 07xx phone", () => {
    for (const b of bookings) {
      expect(b.contactName).not.toBe("");
      expect(b.contactEmail).toContain("@");
      expect(b.contactPhone).toMatch(/^07\d{8}$/);
    }
  });

  it("uses yellowish open, red cancelled, and distinct confirmed/full tones", () => {
    const open = bookingStatusTone("open");
    const cancelled = bookingStatusTone("cancelled");
    const full = bookingStatusTone("full");
    const confirmed = bookingStatusTone("confirmed");

    expect(open.backgroundColor).toBe(theme.colors.statusOpen);
    expect(open.color).toBe(theme.colors.forest);
    expect(cancelled.backgroundColor).toBe(theme.colors.statusDanger);
    expect(cancelled.color).toBe(theme.colors.forest);
    expect(full.backgroundColor).toBe(theme.colors.forestFill);
    expect(full.color).toBe(theme.colors.ivory);
    expect(confirmed.backgroundColor).toBe(theme.colors.surfaceMuted);
    expect(confirmed.color).toBe(theme.colors.ivory);
  });

  it("filters bookings by status and pitch", () => {
    const openOnly = filterBookings(bookings, { status: "open" });
    expect(openOnly.every((booking) => booking.status === "open")).toBe(true);
    expect(openOnly.length).toBeGreaterThan(0);

    const pitch = filterBookings(bookings, { pitchId: "p-1" });
    expect(pitch.every((booking) => booking.pitchId === "p-1")).toBe(true);

    const both = filterBookings(bookings, {
      status: "cancelled",
      pitchId: "p-1",
    });
    expect(both).toHaveLength(1);
    expect(both[0]?.id).toBe("b-4");
  });
});

