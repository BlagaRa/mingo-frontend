import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/lib/mock/queries", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mock/queries")>();
  return {
    ...actual,
    bookings: [],
  };
});

import RezervariPage from "./page";

describe("RezervariPage empty", () => {
  it("shows an empty state when there are no bookings", async () => {
    const ui = await RezervariPage({
      searchParams: Promise.resolve({}),
    });
    render(ui);
    expect(screen.getByRole("status")).toHaveTextContent("Nicio rezervare încă");
    expect(
      screen.getAllByRole("link", { name: "Rezervă acum" }).length,
    ).toBeGreaterThan(0);
  });
});
