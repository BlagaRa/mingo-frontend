import { beforeEach, describe, expect, it } from "vitest";
import { bookings } from "./fixtures";
import {
  closeDayRange,
  daysWithOpenHours,
  isStartOpen,
  listSlots,
  openAllStarts,
  resetSlotStore,
  setStartOpen,
  slotsForPitchDay,
} from "./slot-store";
import { OWNER_START_HOURS } from "./hours";
import { resetBookingStore } from "./booking-store";
import { resetProgramStore } from "./program-store";

describe("OWNER_START_HOURS", () => {
  it("includes half-hour starts for a one-hour booking grid", () => {
    expect(OWNER_START_HOURS).toContain("11:00");
    expect(OWNER_START_HOURS).toContain("11:30");
    expect(OWNER_START_HOURS).not.toContain("11:15");
    expect(OWNER_START_HOURS[0]).toBe("08:00");
    expect(OWNER_START_HOURS.at(-1)).toBe("20:30");
  });
});

describe("slot-store", () => {
  beforeEach(() => {
    resetProgramStore();
    resetSlotStore();
    resetBookingStore();
  });

  it("defaults open inside the program window without a prior toggle", () => {
    const day = "2026-12-09";
    expect(isStartOpen("p-1", day, "11:30")).toBe(true);
    expect(setStartOpen("p-1", day, "11:30", false).ok).toBe(true);
    expect(isStartOpen("p-1", day, "11:30")).toBe(false);
    expect(setStartOpen("p-1", day, "11:30", true).ok).toBe(true);
    expect(isStartOpen("p-1", day, "11:30")).toBe(true);
    const slot = slotsForPitchDay("p-1", day).find((s) =>
      s.startsAt.includes("T11:30"),
    );
    expect(slot?.endsAt).toContain("T12:30");
  });

  it("blocks closing a start that has an active booking", () => {
    const booked = bookings.find((b) => b.status !== "cancelled")!;
    const slot = listSlots().find((s) => s.id === booked.slotId)!;
    const day = slot.startsAt.slice(0, 10);
    const hour = slot.startsAt.slice(11, 16);
    const result = setStartOpen(slot.pitchId, day, hour, false);
    expect(result.ok).toBe(false);
    expect(isStartOpen(slot.pitchId, day, hour)).toBe(true);
  });

  it("closes a day range while skipping booked hours", () => {
    openAllStarts("p-9", "2026-12-10");
    expect(isStartOpen("p-9", "2026-12-10", "11:00")).toBe(true);
    const closed = closeDayRange("p-9", "2026-12-10", "2026-12-12");
    expect(closed.daysTouched).toBe(3);
    expect(isStartOpen("p-9", "2026-12-10", "11:00")).toBe(false);
    expect(daysWithOpenHours("p-9").has("2026-12-10")).toBe(false);
  });
});
