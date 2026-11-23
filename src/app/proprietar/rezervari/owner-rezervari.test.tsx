import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const searchParamsState = { value: "" };

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(searchParamsState.value),
  usePathname: () => "/proprietar/rezervari",
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

import OwnerRezervariPage from "./page";

describe("OwnerRezervariPage", () => {
  beforeEach(() => {
    searchParamsState.value = "";
  });

  it("filters by status from the URL", () => {
    searchParamsState.value = "status=cancelled";
    render(<OwnerRezervariPage />);
    expect(screen.getAllByText("Anulată").length).toBeGreaterThan(0);
    expect(screen.queryByTestId("status-icon-open")).toBeNull();
  });

  it("shows empty state when filters match nothing", () => {
    searchParamsState.value = "q=zzzz-inexistent";
    render(<OwnerRezervariPage />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Nicio rezervare pe filtrele astea",
    );
  });
});
