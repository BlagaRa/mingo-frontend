import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () =>
    new URLSearchParams("pitchId=p-1&slotId=s-2"),
}));

import RezervareNouaPage from "./page";

describe("RezervareNouaPage preselected slot", () => {
  it("opens the wizard on the contact step with day and hour filled", async () => {
    render(<RezervareNouaPage />);
    expect(await screen.findByLabelText("Nume")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByText("19:00–20:00")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rezervă" })).toBeInTheDocument();
  });
});
