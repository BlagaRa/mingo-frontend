import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams("pitchId=p-1"),
}));

vi.mock("@/lib/mock/schedule", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mock/schedule")>();
  return {
    ...actual,
    availableDays: () => [],
    freeHoursForDay: () => [],
  };
});

import RezervareNouaPage from "./page";

describe("RezervareNouaPage no days", () => {
  it("shows an empty state when the pitch has no free days", async () => {
    render(<RezervareNouaPage />);
    expect(
      await screen.findByText("Nicio zi liberă pe terenul ăsta"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Vezi alte terenuri" }),
    ).toHaveAttribute("href", "/terenuri");
  });
});
