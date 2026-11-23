import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import RezervareNouaLoading from "./loading";

describe("RezervareNouaLoading", () => {
  it("renders a skeleton for the booking form", () => {
    render(<RezervareNouaLoading />);
    expect(
      screen.getByRole("status", {
        name: "Se încarcă formularul de rezervare",
      }),
    ).toBeInTheDocument();
  });
});
