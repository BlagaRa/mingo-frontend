import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/mock/queries", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mock/queries")>();
  return {
    ...actual,
    ownerPitches: () => [],
    getPitch: () => undefined,
  };
});

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "missing-pitch" }),
  useSearchParams: () => new URLSearchParams(""),
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

import ProprietarTerenuriPage from "./page";
import EditPitchPage from "./[id]/page";
import OwnerAvailabilityPage from "../disponibilitate/page";

describe("owner pitch feedback", () => {
  it("shows empty state when the owner has no pitches", async () => {
    const ui = await ProprietarTerenuriPage({
      searchParams: Promise.resolve({}),
    });
    render(ui);
    expect(screen.getByRole("status")).toHaveTextContent("Niciun teren încă");
    expect(
      screen.getAllByRole("link", { name: "Adaugă teren" })[0],
    ).toHaveAttribute("href", "/proprietar/terenuri/nou");
  });

  it("shows error state when editing a missing pitch", () => {
    render(<EditPitchPage />);
    expect(screen.getByRole("alert")).toHaveTextContent("Terenul nu e aici");
    expect(
      screen.getByRole("link", { name: "Înapoi la terenuri" }),
    ).toHaveAttribute("href", "/proprietar/terenuri");
  });

  it("shows empty state on availability without pitches", () => {
    render(<OwnerAvailabilityPage />);
    expect(screen.getByText("Adaugă un teren întâi")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Adaugă teren" })).toHaveAttribute(
      "href",
      "/proprietar/terenuri/nou",
    );
  });
});
