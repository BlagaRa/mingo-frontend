import { describe, expect, it } from "vitest";
import { appConfig } from "./app";

describe("appConfig", () => {
  it("exposes a non-empty app name", () => {
    expect(appConfig.name.length).toBeGreaterThan(0);
  });

  it("keeps min viewport at least 360", () => {
    expect(appConfig.minViewportPx).toBeGreaterThanOrEqual(360);
  });
});
