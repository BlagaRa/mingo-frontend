import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PreturiPage from "./page";

describe("PreturiPage", () => {
  it("shows owner pricing heading and signup link for Club", () => {
    render(<PreturiPage />);
    expect(
      screen.getByRole("heading", { name: "Planuri pentru terenurile tale" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Alege Club" })).toHaveAttribute(
      "href",
      "/inregistrare?role=owner&plan=club",
    );
  });
});
