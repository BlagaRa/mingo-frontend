import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OwnerPlansPage from "./page";

describe("OwnerPlansPage", () => {
  it("shows current Club plan and change options without signup links", () => {
    render(<OwnerPlansPage />);
    expect(
      screen.getByRole("heading", { name: "Abonament" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Planul tău")).toBeInTheDocument();
    expect(screen.getByTestId("current-plan-name")).toHaveTextContent("Club");
    expect(screen.getAllByText("Tot din Start").length).toBeGreaterThan(0);
    expect(screen.getByText("Plan curent")).toBeInTheDocument();
    expect(screen.getByText("Activ")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Alege Club" })).toBeNull();
    expect(
      screen.getAllByRole("button", { name: /Schimbă|Plan curent|Demo/i })
        .length,
    ).toBeGreaterThan(0);
  });
});

