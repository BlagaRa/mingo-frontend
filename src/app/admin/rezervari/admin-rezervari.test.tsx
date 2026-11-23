import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { bookings } from "@/lib/mock/fixtures";
import { CRM_PAGE_SIZE } from "@/lib/mock/paginate";
import AdminRezervariPage from "./page";

describe("AdminRezervariPage", () => {
  it("uses the same seats and status labels as the player table", async () => {
    const ui = await AdminRezervariPage({
      searchParams: Promise.resolve({}),
    });
    render(ui);
    expect(screen.getAllByTestId("status-icon-open").length).toBeGreaterThan(0);
    expect(
      screen.getAllByTestId("status-icon-cancelled").length,
    ).toBeGreaterThan(0);
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row").length).toBeGreaterThan(1);
  });

  it("filters by status and paginates", async () => {
    const filteredUi = await AdminRezervariPage({
      searchParams: Promise.resolve({ status: "cancelled" }),
    });
    const filtered = render(filteredUi);
    expect(screen.getAllByText("Anulată").length).toBeGreaterThan(0);
    expect(screen.queryByTestId("status-icon-open")).toBeNull();
    filtered.unmount();

    const allUi = await AdminRezervariPage({
      searchParams: Promise.resolve({}),
    });
    render(allUi);
    expect(bookings.length).toBeGreaterThan(CRM_PAGE_SIZE);
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row").length - 1).toBeLessThanOrEqual(
      CRM_PAGE_SIZE,
    );
    expect(
      screen.getByRole("navigation", { name: "Paginare" }),
    ).toBeInTheDocument();
  });

  it("shows empty state when filters match nothing", async () => {
    const ui = await AdminRezervariPage({
      searchParams: Promise.resolve({ q: "zzzz-inexistent" }),
    });
    render(ui);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Nicio rezervare pe filtrele astea",
    );
  });
});
