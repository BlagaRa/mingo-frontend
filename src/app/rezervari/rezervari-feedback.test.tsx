import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RezervariLoading from "./loading";
import NotFound from "../not-found";

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "missing-booking" }),
}));

import RezervareDetailPage from "./[id]/page";

describe("rezervari feedback surfaces", () => {
  it("renders table skeleton on loading", () => {
    render(<RezervariLoading />);
    expect(
      screen.getByRole("status", { name: "Se încarcă rezervările" }),
    ).toBeInTheDocument();
  });

  it("shows an error state for a missing booking", () => {
    render(<RezervareDetailPage />);
    expect(screen.getByRole("alert")).toHaveTextContent("Rezervarea nu e aici");
    expect(
      screen.getByRole("link", { name: "Înapoi la rezervări" }),
    ).toHaveAttribute("href", "/rezervari");
  });

  it("shows a global not-found error state", () => {
    render(<NotFound />);
    expect(screen.getByText("Pagina nu există")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Vezi terenuri" })).toHaveAttribute(
      "href",
      "/terenuri",
    );
  });
});

