import { describe, expect, it } from "vitest";
import { DEMO_OWNER_ID } from "./demo";
import { ownerBookingStats } from "./queries";
import {
  chartGrainFor,
  DEMO_STATS_TODAY,
  ownerStatsReport,
  resolveStatsRange,
} from "./owner-stats";

describe("resolveStatsRange", () => {
  it("resolves today week and month around the demo today", () => {
    expect(resolveStatsRange("today")).toEqual({
      from: DEMO_STATS_TODAY,
      to: DEMO_STATS_TODAY,
    });
    expect(resolveStatsRange("week")).toEqual({
      from: "2026-12-07",
      to: "2026-12-13",
    });
    expect(resolveStatsRange("month")).toEqual({
      from: "2026-12-01",
      to: "2026-12-31",
    });
  });

  it("orders a custom range so from comes before to", () => {
    expect(
      resolveStatsRange("custom", { from: "2026-12-20", to: "2026-12-10" }),
    ).toEqual({ from: "2026-12-10", to: "2026-12-20" });
  });
});

describe("chartGrainFor", () => {
  it("picks hour day week or month from the filter", () => {
    expect(
      chartGrainFor("today", { from: DEMO_STATS_TODAY, to: DEMO_STATS_TODAY }),
    ).toBe("hour");
    expect(
      chartGrainFor("week", { from: "2026-12-07", to: "2026-12-13" }),
    ).toBe("day");
    expect(
      chartGrainFor("custom", { from: "2026-01-01", to: "2026-06-30" }),
    ).toBe("month");
  });
});

describe("ownerStatsReport", () => {
  it("matches full owner totals for a wide custom range", () => {
    const baseline = ownerBookingStats(DEMO_OWNER_ID);
    const report = ownerStatsReport(DEMO_OWNER_ID, "", "custom", {
      from: "2020-01-01",
      to: "2030-12-31",
    });
    expect(report.total).toBe(baseline.total);
  });

  it("narrows to one pitch", () => {
    const baseline = ownerBookingStats(DEMO_OWNER_ID);
    const pitch = baseline.byPitch.find((entry) => entry.count > 0)!;
    const report = ownerStatsReport(DEMO_OWNER_ID, pitch.pitch.id, "custom", {
      from: "2020-01-01",
      to: "2030-12-31",
    });
    expect(report.total).toBe(pitch.count);
    expect(report.byPitch).toHaveLength(1);
  });
});
