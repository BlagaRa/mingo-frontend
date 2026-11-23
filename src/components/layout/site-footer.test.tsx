import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("links Planuri proprietari to /preturi", () => {
    render(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: "Planuri proprietari" }),
    ).toHaveAttribute("href", "/preturi");
  });
});
