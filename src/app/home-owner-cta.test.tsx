import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage owner CTA", () => {
  it("links Adaugă-ți terenurile to /preturi", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("link", { name: "Adaugă-ți terenurile" }),
    ).toHaveAttribute("href", "/preturi");
  });
});
