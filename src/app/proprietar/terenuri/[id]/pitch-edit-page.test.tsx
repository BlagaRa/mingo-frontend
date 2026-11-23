import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  isPitchVisible,
  resetPitchVisibilityStore,
} from "@/lib/mock/pitch-visibility-store";

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "p-1" }),
}));

import EditPitchPage from "./page";

describe("EditPitchPage location visibility program", () => {
  beforeEach(() => {
    resetPitchVisibilityStore();
  });

  it("shows address and a map, not lat/lng fields", () => {
    render(<EditPitchPage />);
    expect(screen.getByLabelText(/^Adresă/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Hartă locație/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/Locație \(lat\)/i)).toBeNull();
    expect(screen.queryByLabelText(/Locație \(lng\)/i)).toBeNull();
  });

  it("does not show open-hours count copy", () => {
    render(<EditPitchPage />);
    expect(screen.queryByText(/zile cu ore deschise/i)).toBeNull();
    expect(screen.queryByText(/intervale/i)).toBeNull();
    expect(
      screen.getByRole("link", { name: "Editează programul" }),
    ).toBeInTheDocument();
  });

  it("toggles pitch visibility", async () => {
    const user = userEvent.setup();
    render(<EditPitchPage />);
    expect(isPitchVisible("p-1")).toBe(true);
    await user.click(screen.getByRole("button", { name: "Vizibil" }));
    expect(isPitchVisible("p-1")).toBe(false);
    expect(screen.getByRole("button", { name: "Ascuns" })).toBeInTheDocument();
  });
});
