import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BarChart } from "./bar-chart";

describe("BarChart", () => {
  it("renders title and a bar per datum", () => {
    render(
      <BarChart
        title="Status rezervări"
        data={[
          { label: "open", value: 3 },
          { label: "full", value: 2 },
        ]}
      />,
    );
    expect(screen.getByRole("img", { name: "Status rezervări" })).toBeInTheDocument();
    expect(screen.getByText("open")).toBeInTheDocument();
    expect(screen.getByText("full")).toBeInTheDocument();
  });

  it("shows empty copy when there is no data", () => {
    render(<BarChart title="Gol" data={[]} />);
    expect(screen.getByText("Nu există date")).toBeInTheDocument();
  });
});
