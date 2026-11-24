import { describe, expect, it } from "vitest";
import { pitches } from "./queries";
import { pitchFeatureLabels } from "./pitch-features";

describe("pitchFeatureLabels", () => {
  it("returns at most 5 traits", () => {
    const pitch = pitches[0]!;
    const labels = pitchFeatureLabels(pitch, 5);
    expect(labels.length).toBeLessThanOrEqual(5);
    expect(labels[0]).toBe(pitch.surface);
    expect(labels.some((label) => label.includes("jucători"))).toBe(true);
  });
});
