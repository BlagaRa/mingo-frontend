import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { osmEmbedUrl, PitchLocationMap } from "./pitch-location-map";

describe("PitchLocationMap", () => {
  it("builds an OSM embed centered on the coords", () => {
    const url = osmEmbedUrl(46.783, 23.63);
    expect(url).toContain("openstreetmap.org/export/embed.html");
    expect(url).toContain("marker=46.783%2C23.63");
  });

  it("renders a labeled map for the address", () => {
    render(
      <PitchLocationMap
        lat={46.783}
        lng={23.63}
        address="Cluj-Napoca, Mărăști"
      />,
    );
    expect(
      screen.getByRole("img", { name: /Hartă locație/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Cluj-Napoca, Mărăști")).toBeInTheDocument();
  });
});
