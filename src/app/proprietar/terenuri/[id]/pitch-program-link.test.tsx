import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "p-1" }),
}));

import EditPitchPage from "./page";

describe("EditPitchPage program", () => {
  it("links Editează programul to disponibilitate with pitch", () => {
    render(<EditPitchPage />);
    expect(
      screen.getByRole("link", { name: "Editează programul" }),
    ).toHaveAttribute("href", "/proprietar/disponibilitate?pitch=p-1");
    expect(screen.queryByText("Intervale")).toBeNull();
  });
});
