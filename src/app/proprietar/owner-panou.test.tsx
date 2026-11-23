import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProprietarPage from "./page";

describe("ProprietarPage CRM panou", () => {
  it("leads with actionable counts and clear status language", () => {
    render(<ProprietarPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Panou" }),
    ).toBeInTheDocument();
    expect(screen.getByText("De încasat")).toBeInTheDocument();
    expect(screen.getAllByText("Locuri pline").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Încasate").length).toBeGreaterThan(0);
    expect(screen.queryByText("Confirmate")).not.toBeInTheDocument();
    expect(screen.queryByText("Complete")).not.toBeInTheDocument();
    expect(screen.queryByText("Zone")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Adaugă teren" }),
    ).toHaveAttribute("href", "/proprietar/terenuri/nou");
    expect(
      screen.getByRole("img", { name: "Rezervări pe status" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Activitate recentă")).toBeInTheDocument();
    expect(screen.getByText(/nu ai marcat banii/i)).toBeInTheDocument();
    expect(screen.getByText(/nu neapărat încasat/i)).toBeInTheDocument();
  });
});
