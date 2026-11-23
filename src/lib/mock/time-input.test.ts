import { describe, expect, it } from "vitest";
import { normalizeTimeInput, parseTimeInput } from "./time-input";

describe("parseTimeInput", () => {
  it("accepts HH:mm on the half-hour grid", () => {
    expect(parseTimeInput("08:00")).toBe("08:00");
    expect(parseTimeInput("20:30")).toBe("20:30");
    expect(parseTimeInput("6:00")).toBe("06:00");
  });

  it("rejects garbage and odd minutes", () => {
    expect(parseTimeInput("")).toBeNull();
    expect(parseTimeInput("25:00")).toBeNull();
    expect(parseTimeInput("08:15")).toBeNull();
    expect(parseTimeInput("abc")).toBeNull();
  });
});

describe("normalizeTimeInput", () => {
  it("keeps digits and one colon while typing", () => {
    expect(normalizeTimeInput("083")).toBe("08:3");
    expect(normalizeTimeInput("08:30")).toBe("08:30");
    expect(normalizeTimeInput("08:309")).toBe("08:30");
  });

  it("clamps hours to 23 and minutes to 59", () => {
    expect(normalizeTimeInput("25:00")).toBe("23:00");
    expect(normalizeTimeInput("12:99")).toBe("12:59");
    expect(normalizeTimeInput("99:99")).toBe("23:59");
  });
});
