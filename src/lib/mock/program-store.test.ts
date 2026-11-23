import { beforeEach, describe, expect, it } from "vitest";
import { bookings } from "./fixtures";
import { resetBookingStore } from "./booking-store";
import {
  getPitchProgram,
  isDayClosed,
  isHourClosed,
  resetProgramStore,
  setPitchProgram,
  startHoursInWindow,
} from "./program-store";
import {
  isStartOpen,
  listSlots,
  resetSlotStore,
  setDayClosed,
  setHourClosedSafe,
} from "./slot-store";

describe("startHoursInWindow", () => {
  it("lists half-hour starts inclusive of bounds", () => {
    const hours = startHoursInWindow("08:00", "09:00");
    expect(hours).toEqual(["08:00", "08:30", "09:00"]);
  });

  it("supports a wide evening window", () => {
    const hours = startHoursInWindow("06:00", "23:30");
    expect(hours[0]).toBe("06:00");
    expect(hours.at(-1)).toBe("23:30");
    expect(hours).toContain("11:30");
  });
});

describe("program-store", () => {
  beforeEach(() => {
    resetProgramStore();
    resetSlotStore();
    resetBookingStore();
  });

  it("defaults to 08:00–20:30 and days open inside the window", () => {
    expect(getPitchProgram("p-1")).toEqual({
      startHour: "08:00",
      endHour: "20:30",
    });
    expect(isDayClosed("p-1", "2026-12-10")).toBe(false);
    expect(isStartOpen("p-1", "2026-12-10", "11:30")).toBe(true);
    expect(isStartOpen("p-1", "2026-12-10", "06:00")).toBe(false);
  });

  it("closes and reopens a whole day", () => {
    expect(setDayClosed("p-1", "2026-12-10", true).ok).toBe(true);
    expect(isDayClosed("p-1", "2026-12-10")).toBe(true);
    expect(isStartOpen("p-1", "2026-12-10", "11:30")).toBe(false);
    expect(setDayClosed("p-1", "2026-12-10", false).ok).toBe(true);
    expect(isDayClosed("p-1", "2026-12-10")).toBe(false);
    expect(isStartOpen("p-1", "2026-12-10", "11:30")).toBe(true);
  });

  it("closes a single hour without closing the day", () => {
    expect(setHourClosedSafe("p-1", "2026-12-10", "11:30", true).ok).toBe(
      true,
    );
    expect(isHourClosed("p-1", "2026-12-10", "11:30")).toBe(true);
    expect(isDayClosed("p-1", "2026-12-10")).toBe(false);
    expect(isStartOpen("p-1", "2026-12-10", "11:30")).toBe(false);
    expect(isStartOpen("p-1", "2026-12-10", "11:00")).toBe(true);
  });

  it("widens the program window", () => {
    setPitchProgram("p-1", "06:00", "23:30");
    expect(getPitchProgram("p-1")).toEqual({
      startHour: "06:00",
      endHour: "23:30",
    });
    expect(isStartOpen("p-1", "2026-12-10", "06:00")).toBe(true);
    expect(isStartOpen("p-1", "2026-12-10", "23:30")).toBe(true);
  });

  it("refuses to close an hour that has an active booking", () => {
    const booked = bookings.find((b) => b.status !== "cancelled")!;
    const slot = listSlots().find((s) => s.id === booked.slotId)!;
    const day = slot.startsAt.slice(0, 10);
    const hour = slot.startsAt.slice(11, 16);
    const result = setHourClosedSafe(slot.pitchId, day, hour, true);
    expect(result.ok).toBe(false);
    expect(isStartOpen(slot.pitchId, day, hour)).toBe(true);
  });
});
