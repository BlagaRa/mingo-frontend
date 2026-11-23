import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OwnerStatsPage from "./page";

describe("OwnerStatsPage", () => {
  it("renders KPIs and charts", () => {
    render(<OwnerStatsPage />);
    expect(screen.getByText("Total rezervări")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Rezervări pe teren" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Rezervări pe zi" }),
    ).toBeInTheDocument();
  });
});
