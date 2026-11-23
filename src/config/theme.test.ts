import { describe, expect, it } from "vitest";
import { theme } from "./theme";

describe("theme", () => {
  it("exposes forest ivory coral palette", () => {
    expect(theme.colors.ivory).toBe("#F7F5ED");
    expect(theme.colors.forest).toBe("#073035");
    expect(theme.colors.coral).toBe("#FF8E79");
    expect(theme.colors.surfaceMuted.toLowerCase()).toBe("#ede9df");
    expect(theme.colors.surfaceMuted.toLowerCase()).not.toMatch(/dce8df/);
    expect(theme.colors.statusOpen.toLowerCase()).toBe("#f1e6a8");
    expect(theme.colors.statusDanger.toLowerCase()).toBe("#ffb4a3");

  });


  it("keeps a forest fill for primary actions without reading as black", () => {
    expect(theme.colors.forestFill).toBe("#1B6B5A");
    expect(theme.colors.forestFill).not.toBe(theme.colors.forest);
  });

  it("uses forest as ink and on-coral text, ivory on forest fills", () => {
    expect(theme.colors.ink).toBe(theme.colors.forest);
    expect(theme.colors.onCoral).toBe(theme.colors.forest);
    expect(theme.colors.onForest).toBe(theme.colors.ivory);
  });

  it("keeps radii barely rounded", () => {
    expect(theme.radii.sm).toBe("4px");
    expect(theme.radii.md).toBe("6px");
  });

  it("exposes type scale and motion tokens", () => {
    expect(theme.type.body).toBe("1.0625rem");
    expect(theme.motion.pressMs).toBe(160);
    expect(theme.motion.easeOut).toContain("cubic-bezier");
  });

  it("reads min viewport from env with a safe default", () => {
    expect(theme.minViewportPx).toBeGreaterThanOrEqual(360);
  });
});
