import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PitchPagination } from "./pitch-pagination";

describe("PitchPagination", () => {
  it("renders page links from server metadata and hides when only one page", () => {
    const { rerender } = render(
      <PitchPagination
        page={1}
        totalPages={2}
        filters={{ judet: "Cluj", page: "1" }}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Paginare terenuri" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "href",
      "/terenuri?judet=Cluj&page=2",
    );
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "href",
      "/terenuri?judet=Cluj",
    );

    rerender(
      <PitchPagination page={1} totalPages={1} filters={{}} />,
    );
    expect(
      screen.queryByRole("navigation", { name: "Paginare terenuri" }),
    ).not.toBeInTheDocument();
  });
});
