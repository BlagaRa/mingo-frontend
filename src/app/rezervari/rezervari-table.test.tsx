import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { theme } from "@/config/theme";
import {
  bookings,
  bookingsSortedByStartsAt,
  formatDateTime,
  getSlot,
} from "@/lib/mock/queries";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import RezervariPage from "./page";

describe("RezervariPage table", () => {
  it("shows occupied/total seats and status badges with icons", async () => {
    const ui = await RezervariPage({
      searchParams: Promise.resolve({}),
    });
    render(ui);

    for (const booking of bookings) {
      expect(
        screen.getAllByText(
          `${booking.playerIds.length}/${booking.seatsNeeded}`,
        ).length,
      ).toBeGreaterThan(0);
    }

    expect(screen.queryByText(/libere/)).not.toBeInTheDocument();
    expect(screen.getAllByTestId("status-icon-open").length).toBeGreaterThan(0);
    expect(
      screen.getAllByTestId("status-icon-cancelled").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByTestId("status-icon-full").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByTestId("status-icon-confirmed").length,
    ).toBeGreaterThan(0);

    const open = screen.getAllByTestId("status-icon-open")[0]!.closest("span");
    const cancelled = screen
      .getAllByTestId("status-icon-cancelled")[0]!
      .closest("span");
    expect(open).toHaveStyle({ backgroundColor: theme.colors.statusOpen });
    expect(cancelled).toHaveStyle({
      backgroundColor: theme.colors.statusDanger,
    });
  });


  it("lists bookings soonest first by date in a mobile-ready table", async () => {
    const ui = await RezervariPage({
      searchParams: Promise.resolve({}),
    });
    render(ui);
    const table = screen.getByRole("table");
    expect(table).toHaveClass("mingo-data-table");
    expect(within(table).getAllByRole("cell")[0]).toHaveAttribute(
      "data-label",
      "Teren",
    );
    const ordered = bookingsSortedByStartsAt(bookings)
      .map((booking) => getSlot(booking.slotId)?.startsAt)
      .filter(Boolean)
      .map((iso) => formatDateTime(iso!));
    const cells = screen.getAllByRole("row").slice(1).map((row) => {
      const cellsInRow = row.querySelectorAll("td");
      return cellsInRow[1]?.textContent ?? "";
    });
    expect(cells).toEqual(ordered);
  });

  it("filters the table by status from the URL", async () => {
    const ui = await RezervariPage({
      searchParams: Promise.resolve({ status: "cancelled" }),
    });
    render(ui);
    expect(
      screen.getAllByTestId("status-icon-cancelled").length,
    ).toBeGreaterThan(0);
    expect(screen.queryByTestId("status-icon-full")).not.toBeInTheDocument();
    expect(screen.queryByTestId("status-icon-open")).not.toBeInTheDocument();
  });


  it("shows a filter empty state when nothing matches", async () => {
    const ui = await RezervariPage({
      searchParams: Promise.resolve({
        status: "open",
        pitchId: "p-missing",
      }),
    });
    render(ui);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Nicio rezervare pe filtrele astea",
    );
    expect(
      screen.getByRole("link", { name: "Resetează filtrele" }),
    ).toHaveAttribute("href", "/rezervari");
  });
});
