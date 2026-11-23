import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrendChart } from "./trend-chart";

describe("TrendChart", () => {
  it("renders a polyline for series data", () => {
    const { container } = render(
      <TrendChart
        title="Trend rezervări"
        data={[
          { label: "1 nov", value: 2 },
          { label: "2 nov", value: 4 },
          { label: "3 nov", value: 1 },
        ]}
      />,
    );
    expect(screen.getByRole("img", { name: "Trend rezervări" })).toBeInTheDocument();
    expect(container.querySelector("polyline")).not.toBeNull();
  });

  it("shows empty copy when there is no data", () => {
    render(<TrendChart title="Gol" data={[]} />);
    expect(screen.getByText("Nu există date")).toBeInTheDocument();
  });
});
