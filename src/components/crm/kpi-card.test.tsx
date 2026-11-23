import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KpiCard } from "./kpi-card";

describe("KpiCard", () => {
  it("shows label, value, and hint", () => {
    render(<KpiCard label="Membri" value={12} hint="+2 săptămâna asta" />);
    expect(screen.getByText("Membri")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("+2 săptămâna asta")).toBeInTheDocument();
  });

  it("renders as a link when href is set", () => {
    render(<KpiCard label="Terenuri" value={9} href="/admin/terenuri" />);
    expect(screen.getByRole("link", { name: /Terenuri/i })).toHaveAttribute(
      "href",
      "/admin/terenuri",
    );
  });
});
