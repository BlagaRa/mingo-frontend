import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { users } from "@/lib/mock/fixtures";
import { CRM_PAGE_SIZE } from "@/lib/mock/paginate";

const searchParamsState = { value: "" };

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(searchParamsState.value),
  usePathname: () => "/admin/membri",
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

import AdminMembriPage from "./page";

describe("AdminMembriPage CRM", () => {
  beforeEach(() => {
    searchParamsState.value = "";
  });

  it("filters by role from the URL and shows search", () => {
    searchParamsState.value = "role=owner";
    render(<AdminMembriPage />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    const owners = users.filter((u) => u.role === "owner");
    for (const owner of owners) {
      expect(screen.getByText(owner.name)).toBeInTheDocument();
    }
    expect(screen.queryByText("Andrei Pop")).toBeNull();
  });

  it("shows pagination when there are more members than page size", () => {
    expect(users.length).toBeGreaterThan(CRM_PAGE_SIZE);
    render(<AdminMembriPage />);
    expect(
      screen.getByRole("navigation", { name: "Paginare" }),
    ).toBeInTheDocument();
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row").length - 1).toBeLessThanOrEqual(
      CRM_PAGE_SIZE,
    );
  });

  it("suspends a member after confirm", async () => {
    const user = userEvent.setup();
    render(<AdminMembriPage />);
    const firstName = screen.getAllByRole("row")[1]?.querySelector("td")
      ?.textContent;
    expect(firstName).toBeTruthy();
    await user.click(screen.getAllByRole("button", { name: "Gestionează" })[0]!);
    await user.click(screen.getByRole("button", { name: "Suspendă" }));
    const row = screen.getByText(firstName!).closest("tr");
    expect(row).toHaveTextContent("Suspendat");
  });

  it("shows empty state when filters match nothing", () => {
    searchParamsState.value = "q=zzzz-inexistent";
    render(<AdminMembriPage />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Niciun membru pe filtrele astea",
    );
  });

  it("shows Romanian role and status labels", () => {
    searchParamsState.value = "role=owner";
    render(<AdminMembriPage />);
    const table = screen.getByRole("table");
    expect(within(table).getAllByText("Proprietar").length).toBeGreaterThan(0);
    expect(within(table).queryByText("owner")).toBeNull();
  });
});
