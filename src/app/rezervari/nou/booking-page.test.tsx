import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams("pitchId=p-1"),
}));

import RezervareNouaPage from "./page";

describe("RezervareNouaPage", () => {
  it("locks the pitch from the query and does not list other cities", async () => {
    render(<RezervareNouaPage />);
    expect(await screen.findByText("Teren ales")).toBeInTheDocument();
    expect(screen.getAllByText("Verde Nord 1").length).toBeGreaterThan(0);
    expect(screen.queryByLabelText(/Teren în același oraș/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Timișoara/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Alege alt teren" })).toHaveAttribute(
      "href",
      "/terenuri",
    );
  });

  it("shows an empty state until a day is chosen", async () => {
    render(<RezervareNouaPage />);
    expect(await screen.findByText("Alege o zi")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Zilele libere apar evidențiate în calendar. Cele inactive nu au ore.",
      ),
    ).toBeInTheDocument();
  });
});

