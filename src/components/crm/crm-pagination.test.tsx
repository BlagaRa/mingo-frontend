import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CrmPagination } from "./crm-pagination";

describe("CrmPagination", () => {
  it("builds hrefs under basePath and preserves filters", () => {
    render(
      <CrmPagination
        basePath="/admin/rezervari"
        page={2}
        totalPages={3}
        filters={{ status: "open", page: "2" }}
      />,
    );
    const pageTwo = screen.getByRole("link", { name: "2" });
    expect(pageTwo).toHaveAttribute(
      "href",
      "/admin/rezervari?status=open&page=2",
    );
    expect(pageTwo).toHaveAttribute("data-scroll-preserve", "true");
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "href",
      "/admin/rezervari?status=open",
    );
  });


  it("hides when totalPages is 1", () => {
    const { container } = render(
      <CrmPagination
        basePath="/admin/terenuri"
        page={1}
        totalPages={1}
        filters={{}}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
