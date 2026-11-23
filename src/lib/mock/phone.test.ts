import { describe, expect, it } from "vitest";
import { isValidRoPhone } from "./phone";

describe("isValidRoPhone", () => {
  it("accepts 07xx numbers with or without spaces", () => {
    expect(isValidRoPhone("0712345678")).toBe(true);
    expect(isValidRoPhone("0712 345 678")).toBe(true);
  });

  it("rejects wrong prefix, wrong length and non-digits", () => {
    expect(isValidRoPhone("0612345678")).toBe(false);
    expect(isValidRoPhone("071234567")).toBe(false);
    expect(isValidRoPhone("07123456789")).toBe(false);
    expect(isValidRoPhone("07abcdefgh")).toBe(false);
    expect(isValidRoPhone("")).toBe(false);
  });
});
