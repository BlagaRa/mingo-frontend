import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { theme } from "@/config/theme";
import { resetBookingStore } from "@/lib/mock/booking-store";
import {
  getPitchProgram,
  isDayClosed,
  resetProgramStore,
} from "@/lib/mock/program-store";
import { isStartOpen, resetSlotStore } from "@/lib/mock/slot-store";

const searchState = vi.hoisted(() => ({ query: "pitch=p-1" }));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(searchState.query),
  useRouter: () => ({ replace: vi.fn() }),
}));

import OwnerAvailabilityPage from "./page";

describe("OwnerAvailabilityPage", () => {
  beforeEach(() => {
    resetProgramStore();
    resetSlotStore();
    resetBookingStore();
    searchState.query = "pitch=p-1";
  });

  it("uses a pitch combobox and typed program hours", () => {
    render(<OwnerAvailabilityPage />);
    expect(
      screen.getByRole("heading", { name: "Disponibilitate" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /Teren/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/De la/i)).toHaveAttribute("type", "text");
    expect(screen.getByLabelText(/Până la/i)).toHaveAttribute("type", "text");
    expect(screen.queryByRole("button", { name: "Concediu" })).toBeNull();
    expect(screen.getByRole("button", { name: /11:30/ })).toBeInTheDocument();
  });

  it("shows open hours in ivory and closed hours in coral", async () => {
    const user = userEvent.setup();
    render(<OwnerAvailabilityPage />);
    const openChip = screen.getByRole("button", { name: /11:30.*liber/i });
    expect(openChip).toHaveStyle({
      backgroundColor: theme.colors.ivory,
      color: theme.colors.forest,
    });
    await user.click(openChip);
    const closedChip = screen.getByRole("button", { name: /11:30.*închis/i });
    expect(closedChip).toHaveStyle({
      backgroundColor: theme.colors.coral,
      color: theme.colors.onCoral,
    });
  });

  it("updates the program window from typed times", async () => {
    const user = userEvent.setup();
    render(<OwnerAvailabilityPage />);
    const from = screen.getByLabelText("De la");
    await user.clear(from);
    await user.type(from, "09:00");
    await user.tab();
    expect(getPitchProgram("p-1").startHour).toBe("09:00");
  });

  it("toggles the day open/closed with one button", async () => {
    const user = userEvent.setup();
    render(<OwnerAvailabilityPage />);
    const toggle = screen.getByRole("button", { name: "Azi deschis" });
    await user.click(toggle);
    expect(isDayClosed("p-1", "2026-12-10")).toBe(true);
    expect(isStartOpen("p-1", "2026-12-10", "11:30")).toBe(false);
    expect(
      screen.getByRole("button", { name: "Azi închis" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Azi închis" }));
    expect(isDayClosed("p-1", "2026-12-10")).toBe(false);
    expect(isStartOpen("p-1", "2026-12-10", "11:30")).toBe(true);
  });

  it("closes a single hour from the grid", async () => {
    const user = userEvent.setup();
    render(<OwnerAvailabilityPage />);
    expect(isStartOpen("p-1", "2026-12-10", "11:30")).toBe(true);
    await user.click(screen.getByRole("button", { name: /11:30/i }));
    expect(isStartOpen("p-1", "2026-12-10", "11:30")).toBe(false);
  });
});
