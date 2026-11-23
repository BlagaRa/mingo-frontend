import { describe, expect, it } from "vitest";
import { CRM_PAGE_SIZE, paginate } from "./paginate";

describe("paginate", () => {
  const items = Array.from({ length: 12 }, (_, i) => i + 1);

  it("uses CRM_PAGE_SIZE 5 by default and returns page metadata", () => {
    expect(CRM_PAGE_SIZE).toBe(5);
    const first = paginate(items, "1");
    expect(first.pageSize).toBe(5);
    expect(first.page).toBe(1);
    expect(first.total).toBe(12);
    expect(first.totalPages).toBe(3);
    expect(first.items).toEqual([1, 2, 3, 4, 5]);
  });

  it("clamps out-of-range and invalid page params", () => {
    expect(paginate(items, "999").page).toBe(3);
    expect(paginate(items, "0").page).toBe(1);
    expect(paginate(items, "nope").page).toBe(1);
    expect(paginate(items, undefined).page).toBe(1);
  });

  it("returns totalPages 0 for an empty list", () => {
    const empty = paginate([], "1");
    expect(empty.total).toBe(0);
    expect(empty.totalPages).toBe(0);
    expect(empty.items).toEqual([]);
    expect(empty.page).toBe(1);
  });
});
