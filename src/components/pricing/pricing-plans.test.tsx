import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PricingPlans } from "./pricing-plans";

describe("PricingPlans", () => {
  it("highlights Club with Cel mai folosit and cumulative Tot din Start", () => {
    render(<PricingPlans ctaMode="signup" />);
    expect(screen.getByText("Cel mai folosit")).toBeInTheDocument();
    expect(screen.getByText("Tot din Start")).toBeInTheDocument();
    expect(screen.getByText("Tot din Club")).toBeInTheDocument();
  });

  it("links signup CTAs with role and plan query", () => {
    render(<PricingPlans ctaMode="signup" />);
    expect(screen.getByRole("link", { name: "Alege Club" })).toHaveAttribute(
      "href",
      "/inregistrare?role=owner&plan=club",
    );
  });

  it("renders disabled demo buttons when ctaMode is none", () => {
    render(<PricingPlans ctaMode="none" />);
    expect(screen.queryByRole("link", { name: "Alege Club" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Alege Club" })).toBeNull();
    const demos = screen.getAllByRole("button", { name: "Demo — fără plată" });
    expect(demos).toHaveLength(3);
    expect(demos[0]).toBeDisabled();
  });
});
