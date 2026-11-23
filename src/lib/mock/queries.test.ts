import { beforeEach, describe, expect, it } from "vitest";
import {
  bookingPriceRon,
  bookingsSortedByStartsAt,
  filterPitches,
  formatRon,
  getSlot,
  openSeats,
  ownerBookingStats,
  PITCH_PAGE_SIZE,
  queryPitchesPage,
  uniqueLocations,
} from "./queries";
import { bookings, pitches } from "./fixtures";
import {
  resetPitchVisibilityStore,
  setPitchVisible,
} from "./pitch-visibility-store";

describe("filterPitches", () => {
  beforeEach(() => {
    resetPitchVisibilityStore();
  });

  it("filters by judet oras and zona", () => {
    const result = filterPitches(pitches, {
      judet: "Cluj",
      oras: "Cluj-Napoca",
      zona: "Mărăști",
    });
    expect(result.map((pitch) => pitch.id)).toEqual(["p-1", "p-2"]);
  });

  it("filters by amenity chips", () => {
    const covered = filterPitches(pitches, { covered: "1" });
    expect(covered.every((pitch) => pitch.covered)).toBe(true);
    const indoor = filterPitches(pitches, { indoor: "1", surface: "Sintetic" });
    expect(indoor.every((p) => p.indoor && p.surface === "Sintetic")).toBe(true);
  });

  it("returns all pitches when filters are empty", () => {
    expect(filterPitches(pitches, {})).toHaveLength(pitches.length);
  });

  it("hides pitches marked not visible", () => {
    setPitchVisible("p-1", false);
    const result = filterPitches(pitches, {});
    expect(result.some((pitch) => pitch.id === "p-1")).toBe(false);
    expect(result).toHaveLength(pitches.length - 1);
  });
});

describe("queryPitchesPage", () => {
  beforeEach(() => {
    resetPitchVisibilityStore();
  });

  it("paginates filtered pitches on the server with page metadata", () => {
    const first = queryPitchesPage({ page: "1" });
    expect(first.page).toBe(1);
    expect(first.pageSize).toBe(PITCH_PAGE_SIZE);
    expect(first.total).toBe(pitches.length);
    expect(first.totalPages).toBe(Math.ceil(pitches.length / PITCH_PAGE_SIZE));
    expect(first.items).toHaveLength(Math.min(PITCH_PAGE_SIZE, pitches.length));
    expect(first.items.map((pitch) => pitch.id)).toEqual(
      pitches.slice(0, PITCH_PAGE_SIZE).map((pitch) => pitch.id),
    );

    const second = queryPitchesPage({ page: "2" });
    expect(second.page).toBe(2);
    expect(second.items.map((pitch) => pitch.id)).toEqual(
      pitches.slice(PITCH_PAGE_SIZE, PITCH_PAGE_SIZE * 2).map((pitch) => pitch.id),
    );
  });

  it("filters before paginating", () => {
    const result = queryPitchesPage({ judet: "Cluj", page: "1" });
    expect(result.items.every((pitch) => pitch.judet === "Cluj")).toBe(true);
    expect(result.total).toBe(
      filterPitches(pitches, { judet: "Cluj" }).length,
    );
  });
});


describe("pricing helpers", () => {
  it("uses the hourly whole-pitch price", () => {
    const pitch = pitches[0];
    expect(bookingPriceRon(pitch)).toBe(pitch.pricePerHourRon);
    expect(bookingPriceRon(pitch)).toBe(200);
  });

  it("formats ron with Intl", () => {
    expect(formatRon(200)).toMatch(/200/);
    expect(formatRon(200)).toMatch(/RON|lei/i);
  });
});

describe("bookings", () => {
  it("counts open seats on incomplete bookings", () => {
    expect(openSeats(bookings[0])).toBe(8);
    expect(openSeats(bookings[2])).toBe(0);
  });

  it("sorts bookings by slot startsAt ascending (soonest first)", () => {
    const sorted = bookingsSortedByStartsAt(bookings);
    const times = sorted.map(
      (booking) => getSlot(booking.slotId)?.startsAt ?? "",
    );
    expect(times).toEqual([...times].sort());
    expect(sorted.map((booking) => booking.id)).not.toEqual(
      bookings.map((booking) => booking.id),
    );
  });
});


describe("uniqueLocations", () => {
  it("builds cascading location options", () => {
    const locations = uniqueLocations(pitches);
    expect(locations.judete).toContain("Cluj");
    expect(locations.oraseByJudet.Cluj).toContain("Cluj-Napoca");
    expect(locations.zoneByOras["Cluj-Napoca"]).toContain("Mărăști");
  });
});

describe("ownerBookingStats", () => {
  it("aggregates cancelled, confirmed and pending for an owner", () => {
    const stats = ownerBookingStats("u-owner");
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.cancelled).toBeGreaterThanOrEqual(1);
    expect(stats.pending).toBeGreaterThanOrEqual(0);
    expect(
      stats.confirmed +
        stats.cancelled +
        stats.open +
        stats.full +
        stats.pending,
    ).toBe(stats.total);
  });
});
