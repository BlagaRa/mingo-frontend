import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams("judet=Inexistent"),
}));

import TerenuriPage from "./page";
import TerenuriLoading from "./loading";

describe("TerenuriPage feedback", () => {
  it("shows an empty state when filters match nothing", async () => {
    const ui = await TerenuriPage({
      searchParams: Promise.resolve({ judet: "Inexistent" }),
    });
    render(ui);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Niciun teren pe filtrele astea",
    );
    expect(
      screen.getByRole("link", { name: "Resetează filtrele" }),
    ).toHaveAttribute("href", "/terenuri");
  });

  it("renders skeleton loading for the list route", () => {
    render(<TerenuriLoading />);
    expect(
      screen.getByRole("status", { name: "Se încarcă terenurile" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("status", { name: "Se încarcă filtrele" }),
    ).toBeInTheDocument();
  });

  it("renders server-paginated results with page controls", async () => {
    const ui = await TerenuriPage({
      searchParams: Promise.resolve({}),
    });
    render(ui);
    expect(screen.getByText(/terenuri · pagina 1 din/i)).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Paginare terenuri" }),
    ).toBeInTheDocument();
  });
});

