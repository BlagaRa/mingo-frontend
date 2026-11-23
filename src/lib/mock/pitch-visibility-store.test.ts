import { beforeEach, describe, expect, it } from "vitest";
import {
  isPitchVisible,
  resetPitchVisibilityStore,
  setPitchVisible,
} from "./pitch-visibility-store";

describe("pitch-visibility-store", () => {
  beforeEach(() => {
    resetPitchVisibilityStore();
  });

  it("defaults pitches to visible", () => {
    expect(isPitchVisible("p-1")).toBe(true);
  });

  it("hides and shows a pitch", () => {
    setPitchVisible("p-1", false);
    expect(isPitchVisible("p-1")).toBe(false);
    setPitchVisible("p-1", true);
    expect(isPitchVisible("p-1")).toBe(true);
  });
});
