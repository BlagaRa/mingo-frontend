import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OwnerPlansPage from "./page";

describe("OwnerPlansPage", () => {
  it("renders shared plans with featured Club and no signup links", () => {
    render(<OwnerPlansPage />);
    expect(screen.getByText("Cel mai folosit")).toBeInTheDocument();
    expect(screen.getByText("Tot din Start")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Alege Club" })).toBeNull();
    expect(
      screen.getAllByRole("button", { name: "Demo — fără plată" })[0],
    ).toBeDisabled();
  });
});
