import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { resetBookingStore } from "@/lib/mock/booking-store";
import { resetProgramStore } from "@/lib/mock/program-store";
import { resetSlotStore } from "@/lib/mock/slot-store";
import OwnerRezervariPage from "./page";

describe("OwnerRezervariPage actions + contact", () => {
  beforeEach(() => {
    resetProgramStore();
    resetSlotStore();
    resetBookingStore();
  });

  it("shows contact email and phone per day booking", () => {
    render(<OwnerRezervariPage />);
    const row = screen.getAllByTestId("day-booking")[0]!;
    expect(within(row).getByText(/@example\.com$/)).toBeInTheDocument();
    expect(within(row).getByText(/^07\d+$/)).toBeInTheDocument();
  });

  it("has no standalone Marchează încasată/Anulează buttons at rest", () => {
    render(<OwnerRezervariPage />);
    expect(
      screen.queryByRole("button", { name: "Marchează încasată" }),
    ).toBeNull();
    expect(screen.queryByRole("button", { name: "Anulează" })).toBeNull();
    expect(
      screen.getAllByRole("button", { name: "Acțiuni" }).length,
    ).toBeGreaterThan(0);
  });

  it("marks an open booking as încasată from the action menu", async () => {
    const user = userEvent.setup();
    render(<OwnerRezervariPage />);
    const row = screen.getAllByTestId("day-booking")[0]!;
    await user.click(within(row).getByRole("button", { name: "Acțiuni" }));
    await user.click(
      screen.getByRole("menuitem", { name: "Marchează încasată" }),
    );
    expect(within(row).getByText("Încasată")).toBeInTheDocument();
  });
});
