import { beforeEach, describe, expect, it } from "vitest";
import { bookings } from "./fixtures";
import {
  confirmBooking,
  getBooking,
  listBookings,
  resetBookingStore,
  upsertBooking,
} from "./booking-store";
import type { Booking } from "./types";

const pendingBooking: Booking = {
  id: "b-pending",
  pitchId: "p-1",
  slotId: "s-1",
  hostId: "u-player",
  playerIds: ["u-player"],
  status: "pending",
  seatsNeeded: 10,
  contactName: "Andrei Pop",
  contactEmail: "andrei@example.com",
  contactPhone: "0721123456",
};

describe("booking store", () => {
  beforeEach(() => resetBookingStore());

  it("starts from a copy of the fixtures", () => {
    const list = listBookings();
    expect(list).toEqual(bookings);
    list.pop();
    expect(listBookings()).toHaveLength(bookings.length);
  });

  it("gets a booking by id", () => {
    expect(getBooking("b-1")?.id).toBe("b-1");
    expect(getBooking("missing")).toBeUndefined();
  });

  it("inserts a new booking and replaces an existing one", () => {
    upsertBooking({ ...pendingBooking });
    expect(getBooking("b-pending")?.status).toBe("pending");
    expect(listBookings()).toHaveLength(bookings.length + 1);

    upsertBooking({ ...pendingBooking, seatsNeeded: 12 });
    expect(getBooking("b-pending")?.seatsNeeded).toBe(12);
    expect(listBookings()).toHaveLength(bookings.length + 1);
  });

  it("confirms a pending booking by opening it", () => {
    upsertBooking({ ...pendingBooking });
    expect(confirmBooking("b-pending")?.status).toBe("open");
    expect(getBooking("b-pending")?.status).toBe("open");
  });

  it("leaves non-pending bookings unchanged and ignores unknown ids", () => {
    expect(confirmBooking("b-4")?.status).toBe("cancelled");
    expect(confirmBooking("missing")).toBeUndefined();
  });
});
