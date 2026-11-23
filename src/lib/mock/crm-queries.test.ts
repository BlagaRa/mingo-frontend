import { describe, expect, it } from "vitest";
import { DEMO_OWNER_ID } from "./demo";
import {
  adminPlatformStats,
  filterAdminPitches,
  filterBookings,
  filterUsers,
  ownerBookingSeries,
  ownerBookings,
  queryOwnerBookingsPage,
} from "./crm-queries";
import { bookings, pitches, users } from "./fixtures";
import { CRM_PAGE_SIZE } from "./paginate";

describe("crm-queries", () => {
  it("adminPlatformStats matches fixture totals and exposes status + series", () => {
    const stats = adminPlatformStats();
    expect(stats.users).toBe(users.length);
    expect(stats.pitches).toBe(pitches.length);
    expect(stats.bookings).toBe(bookings.length);
    expect(stats.byStatus.length).toBeGreaterThan(0);
    const statusSum = stats.byStatus.reduce((sum, row) => sum + row.count, 0);
    expect(statusSum).toBe(bookings.length);
    expect(stats.byStatus).toContainEqual({ status: "pending", count: 1 });
    expect(stats.series.length).toBeGreaterThanOrEqual(1);
  });

  it("filterUsers filters by role, status, and q", () => {
    expect(filterUsers(users, { role: "owner" }).every((u) => u.role === "owner")).toBe(
      true,
    );
    expect(
      filterUsers(users, { status: "suspended" }).every(
        (u) => u.status === "suspended",
      ),
    ).toBe(true);
    const q = filterUsers(users, { q: "andrei" });
    expect(q.length).toBeGreaterThan(0);
    expect(q.every((u) => /andrei/i.test(`${u.name} ${u.email}`))).toBe(true);
  });

  it("ownerBookings only includes DEMO_OWNER_ID pitches", () => {
    const mine = new Set(
      pitches.filter((p) => p.ownerId === DEMO_OWNER_ID).map((p) => p.id),
    );
    const rows = ownerBookings(DEMO_OWNER_ID);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((b) => mine.has(b.pitchId))).toBe(true);
  });

  it("queryOwnerBookingsPage paginates when owner has more than CRM_PAGE_SIZE", () => {
    const page1 = queryOwnerBookingsPage(DEMO_OWNER_ID, { page: "1" });
    expect(page1.total).toBeGreaterThan(CRM_PAGE_SIZE);
    expect(page1.items.length).toBe(CRM_PAGE_SIZE);
    const page2 = queryOwnerBookingsPage(DEMO_OWNER_ID, { page: "2" });
    expect(page2.items.length).toBeGreaterThan(0);
    expect(page2.page).toBe(2);
  });

  it("fixtures are large enough for CRM pagination demos", () => {
    expect(users.length).toBeGreaterThanOrEqual(12);
    expect(bookings.length).toBeGreaterThanOrEqual(16);
    expect(
      pitches.filter((p) => p.ownerId === DEMO_OWNER_ID).length,
    ).toBeGreaterThan(CRM_PAGE_SIZE);
  });

  it("filterBookings and filterAdminPitches match q and status", () => {
    expect(
      filterBookings(bookings, { status: "cancelled" }).every(
        (b) => b.status === "cancelled",
      ),
    ).toBe(true);
    expect(filterBookings(bookings, { q: "Verde Nord 1" }).length).toBeGreaterThan(
      0,
    );
    expect(filterAdminPitches(pitches, { q: "Brașov" }).map((p) => p.id)).toEqual([
      "p-7",
    ]);
  });

  it("ownerBookingSeries returns labeled day counts for the owner", () => {
    const series = ownerBookingSeries(DEMO_OWNER_ID);
    expect(series.length).toBeGreaterThanOrEqual(1);
    expect(series.every((row) => row.value > 0 && row.label.length > 0)).toBe(
      true,
    );
  });
});
