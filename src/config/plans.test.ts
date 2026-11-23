import { describe, expect, it } from "vitest";
import { getPlan, planDisplayFeatures, plans } from "./plans";

describe("plans", () => {
  it("orders Start, Club, Ligă with Club featured as Cel mai folosit", () => {
    expect(plans.map((p) => p.id)).toEqual(["start", "club", "liga"]);
    expect(plans[1]?.featured).toBe(true);
    expect(plans[1]?.featuredLabel).toBe("Cel mai folosit");
  });

  it("builds cumulative features as previous plan plus extras", () => {
    expect(planDisplayFeatures(plans[0]!)).toEqual([
      "1 teren",
      "Calendar simplu",
      "Support email",
    ]);
    expect(planDisplayFeatures(plans[1]!)[0]).toBe("Tot din Start");
    expect(planDisplayFeatures(plans[2]!)[0]).toBe("Tot din Club");
  });

  it("resolves known ids and rejects unknown", () => {
    expect(getPlan("club")?.name).toBe("Club");
    expect(getPlan("nope")).toBeUndefined();
  });
});
