import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CrmToolbar } from "./crm-toolbar";

describe("CrmToolbar", () => {
  it("shows result count and a search field", () => {
    render(
      <CrmToolbar resultCount={12} searchName="q" searchDefault="verde" />,
    );
    expect(screen.getByText(/12/)).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toHaveAttribute("name", "q");
    expect(screen.getByRole("searchbox")).toHaveValue("verde");
  });
});
