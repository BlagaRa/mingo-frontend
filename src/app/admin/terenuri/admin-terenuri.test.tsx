import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { pitches } from "@/lib/mock/fixtures";
import { CRM_PAGE_SIZE } from "@/lib/mock/paginate";
import AdminTerenuriPage from "./page";

describe("AdminTerenuriPage", () => {
  it("shows toolbar, at most page-size rows, and pagination", async () => {
    expect(pitches.length).toBeGreaterThan(CRM_PAGE_SIZE);
    const ui = await AdminTerenuriPage({
      searchParams: Promise.resolve({}),
    });
    render(ui);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row").length - 1).toBeLessThanOrEqual(
      CRM_PAGE_SIZE,
    );
    expect(
      screen.getByRole("navigation", { name: "Paginare" }),
    ).toBeInTheDocument();
  });

  it("shows empty state when filters match nothing", async () => {
    const ui = await AdminTerenuriPage({
      searchParams: Promise.resolve({ q: "zzzz-inexistent" }),
    });
    render(ui);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Niciun teren pe filtrele astea",
    );
  });
});
