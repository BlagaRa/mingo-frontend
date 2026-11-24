import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams("pitchId=p-1"),
}));

vi.mock("@/lib/mock/schedule", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mock/schedule")>();
  return {
    ...actual,
    availableDays: () => ["2026-11-24"],
    formatDayLong: () => "Marți, 24 noiembrie",
  };
});

vi.mock("@/lib/mock/booking-store", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/mock/booking-store")>();
  return {
    ...actual,
    freeBookableHoursForDay: () => [],
  };
});

import RezervareNouaPage from "./page";

describe("RezervareNouaPage empty hours", () => {
  it("shows an empty state when the selected day has no free hours", async () => {
    const user = userEvent.setup();
    render(<RezervareNouaPage />);
    await user.click(
      await screen.findByRole("button", { name: "Alege 2026-11-24" }),
    );
    expect(await screen.findByText("Nicio oră liberă")).toBeInTheDocument();
  });
});
