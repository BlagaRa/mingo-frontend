import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

  it("keeps the calendar visible when hours appear after picking a day", async () => {
    const user = userEvent.setup();
    render(<RezervareNouaPage />);
    expect(
      await screen.findByRole("button", { name: "Alege 2026-11-24" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /19:00/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Alege 2026-11-24" }));
    expect(
      await screen.findByRole("button", { name: "19:00–20:00" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Alege 2026-11-24" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Progres" })).toBeInTheDocument();
  });
});

