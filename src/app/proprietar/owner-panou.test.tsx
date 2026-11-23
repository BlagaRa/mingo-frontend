import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProprietarPage from "./page";

describe("ProprietarPage CRM panou", () => {
  it("renders KPIs, a chart, and recent activity", () => {
    render(<ProprietarPage />);
    expect(screen.getByText("Terenuri")).toBeInTheDocument();
    expect(screen.getByText("Rezervări")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Rezervări pe status" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Activitate recentă")).toBeInTheDocument();
  });
});
