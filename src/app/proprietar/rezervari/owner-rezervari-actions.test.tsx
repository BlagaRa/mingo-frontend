import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetBookingStore } from "@/lib/mock/booking-store";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(""),
  usePathname: () => "/proprietar/rezervari",
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

import OwnerRezervariPage from "./page";

describe("OwnerRezervariPage actions + contact", () => {
  beforeEach(() => {
    resetBookingStore();
  });

  it("shows contact email and phone per row", () => {
    render(<OwnerRezervariPage />);
    const row = screen.getAllByRole("row")[1]!;
    expect(within(row).getByText(/@example\.com$/)).toBeInTheDocument();
    expect(within(row).getByText(/^07\d+$/)).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Contact" }),
    ).toBeInTheDocument();
  });

  it("has no standalone Confirmă/Anulează buttons at rest", () => {
    render(<OwnerRezervariPage />);
    expect(screen.queryByRole("button", { name: "Confirmă" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Anulează" })).toBeNull();
    expect(
      screen.getAllByRole("button", { name: "Acțiuni" }).length,
    ).toBeGreaterThan(0);
  });

  it("confirms only the targeted row via ⋮ then dialog", async () => {
    const user = userEvent.setup();
    render(<OwnerRezervariPage />);

    const before = screen.queryAllByText("Confirmată").length;
    const trigger = screen.getAllByRole("button", { name: "Acțiuni" })[0]!;
    const row = trigger.closest("tr")!;
    const pitchName = within(row).getAllByRole("cell")[0]!.textContent!;

    await user.click(trigger);
    await user.click(screen.getByRole("menuitem", { name: "Confirmă" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent(pitchName);
    await user.click(within(dialog).getByRole("button", { name: "Confirmă" }));

    expect(within(row).getByText("Confirmată")).toBeInTheDocument();
    expect(screen.getAllByText("Confirmată").length).toBe(before + 1);
  });

  it("cancels only the targeted row via ⋮ then dialog", async () => {
    const user = userEvent.setup();
    render(<OwnerRezervariPage />);

    const before = screen.queryAllByText("Anulată").length;
    const trigger = screen.getAllByRole("button", { name: "Acțiuni" })[0]!;
    const row = trigger.closest("tr")!;

    await user.click(trigger);
    await user.click(screen.getByRole("menuitem", { name: "Anulează" }));
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Anulează" }));

    expect(within(row).getByText("Anulată")).toBeInTheDocument();
    expect(screen.getAllByText("Anulată").length).toBe(before + 1);
  });

  it("omits the menu for cancelled rows", async () => {
    const user = userEvent.setup();
    render(<OwnerRezervariPage />);
    const trigger = screen.getAllByRole("button", { name: "Acțiuni" })[0]!;
    const row = trigger.closest("tr")!;
    await user.click(trigger);
    await user.click(screen.getByRole("menuitem", { name: "Anulează" }));
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Anulează",
      }),
    );
    expect(
      within(row).queryByRole("button", { name: "Acțiuni" }),
    ).toBeNull();
  });
});
