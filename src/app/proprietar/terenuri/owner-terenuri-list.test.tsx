import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DEMO_OWNER_ID } from "@/lib/mock/demo";
import { CRM_PAGE_SIZE } from "@/lib/mock/paginate";
import { ownerPitches } from "@/lib/mock/queries";
import ProprietarTerenuriPage from "./page";

describe("ProprietarTerenuriPage list", () => {
  it("keeps Adaugă teren outside the search/filter form", async () => {
    const ui = await ProprietarTerenuriPage({
      searchParams: Promise.resolve({}),
    });
    render(ui);
    const add = screen.getByRole("link", { name: "Adaugă teren" });
    expect(add).toHaveAttribute("href", "/proprietar/terenuri/nou");
    expect(add.closest("form")).toBeNull();
    expect(screen.getByRole("button", { name: "Filtrează" }).closest("form")).toContainElement(
      screen.getByRole("searchbox"),
    );
  });

  it("paginates owner pitches with mobile data labels", async () => {
    expect(ownerPitches(DEMO_OWNER_ID).length).toBeGreaterThan(CRM_PAGE_SIZE);
    const ui = await ProprietarTerenuriPage({
      searchParams: Promise.resolve({}),
    });
    render(ui);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    const table = screen.getByRole("table");
    expect(table).toHaveClass("mingo-data-table");
    expect(within(table).getAllByRole("row").length - 1).toBeLessThanOrEqual(
      CRM_PAGE_SIZE,
    );
    expect(within(table).getAllByRole("cell")[0]).toHaveAttribute(
      "data-label",
      "Teren",
    );
    expect(
      screen.getByRole("navigation", { name: "Paginare" }),
    ).toBeInTheDocument();
  });

  it("shows empty state when filters match nothing", async () => {
    const ui = await ProprietarTerenuriPage({
      searchParams: Promise.resolve({ q: "zzzz-inexistent" }),
    });
    render(ui);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Niciun teren pe filtrele astea",
    );
  });
});
