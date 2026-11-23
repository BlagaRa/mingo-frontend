import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { resetBookingStore } from "@/lib/mock/booking-store";
import { resetProgramStore } from "@/lib/mock/program-store";
import { resetSlotStore } from "@/lib/mock/slot-store";
import OwnerRezervariPage from "./page";

describe("OwnerRezervariPage", () => {
  beforeEach(() => {
    resetProgramStore();
    resetSlotStore();
    resetBookingStore();
  });

  it("shows month calendar heading and pitch filter", () => {
    render(<OwnerRezervariPage />);
    expect(
      screen.getByRole("heading", { name: "Rezervări" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Teren" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /noiembrie 2026/i }),
    ).toBeInTheDocument();
  });

  it("lists bookings for the selected day", () => {
    render(<OwnerRezervariPage />);
    expect(screen.getAllByTestId("day-booking").length).toBeGreaterThan(0);
  });
});
