import { describe, expect, it } from "vitest";
import {
  availableDays,
  buildMonthCells,
  buildWeekDays,
  freeHoursForDay,
  formatHour,
  formatDayLong,
  formatMonthTitle,
  formatWeekTitle,
  mondayOfWeek,
  pickInitialDay,
  shiftMonth,
  shiftWeek,
  slotDay,
  todayISO,
} from "./schedule";

describe("schedule helpers", () => {
  it("extracts day from slot iso", () => {
    expect(slotDay("2026-11-24T18:00:00+02:00")).toBe("2026-11-24");
  });

  it("lists available days for a pitch across many months", () => {
    const days = availableDays("p-1");
    expect(days.length).toBeGreaterThan(20);
    expect(days[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("returns free hours for a chosen day", () => {
    const day = availableDays("p-1")[0];
    const hours = freeHoursForDay("p-1", day);
    expect(hours.length).toBeGreaterThan(0);
    expect(formatHour(hours[0].startsAt)).toMatch(/\d/);
  });

  it("builds a Monday-start month grid with gray inactive days still labeled", () => {
    const available = new Set(["2026-11-24", "2026-11-30"]);
    const cells = buildMonthCells(2026, 10, available);
    expect(cells).toHaveLength(42);
    const selectable = cells.filter((cell) => cell.selectable);
    expect(selectable.map((cell) => cell.day)).toEqual([
      "2026-11-24",
      "2026-11-30",
    ]);
    const inactive = cells.find(
      (cell) => cell.inMonth && cell.day === "2026-11-25",
    );
    expect(inactive?.selectable).toBe(false);
    expect(inactive?.label).toBe("25");
  });

  it("shifts months and titles in Romanian", () => {
    expect(shiftMonth(2026, 10, 1)).toEqual({ year: 2026, month: 11 });
    expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2027, month: 0 });
    expect(formatMonthTitle(2026, 10)).toMatch(/noiembrie/i);
    expect(formatDayLong("2026-11-24")).toMatch(/noiembrie/i);
  });

  it("builds a Monday-start week and shifts weeks", () => {
    expect(mondayOfWeek("2026-11-25")).toBe("2026-11-23");
    expect(buildWeekDays("2026-11-25")).toEqual([
      "2026-11-23",
      "2026-11-24",
      "2026-11-25",
      "2026-11-26",
      "2026-11-27",
      "2026-11-28",
      "2026-11-29",
    ]);
    expect(shiftWeek("2026-11-23", 1)).toBe("2026-11-30");
    expect(shiftWeek("2026-11-23", -1)).toBe("2026-11-16");
    expect(formatWeekTitle("2026-11-23")).toMatch(/23/);
    expect(formatWeekTitle("2026-11-23")).toMatch(/29/);
  });


  it("picks today when available, otherwise the first free day", () => {
    expect(todayISO(new Date("2026-11-23T15:00:00+02:00"))).toBe("2026-11-23");
    expect(pickInitialDay(["2026-11-24", "2026-11-26"], "2026-11-24")).toBe(
      "2026-11-24",
    );
    expect(pickInitialDay(["2026-11-24", "2026-11-26"], "2026-11-23")).toBe(
      "2026-11-24",
    );
    expect(pickInitialDay([], "2026-11-23")).toBe("");
  });
});

