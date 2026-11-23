import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage CTAs", () => {
  it("keeps two hero actions: book and add pitches", () => {
    render(<HomePage />);
    const book = screen.getAllByRole("link", { name: "Rezervă acum" })[0]!;
    expect(book).toHaveAttribute("href", "/rezervari/nou");
    expect(
      screen.getByRole("link", { name: "Adaugă-ți terenurile" }),
    ).toHaveAttribute("href", "/preturi");
    expect(
      screen.queryByRole("link", { name: "Vezi terenurile" }),
    ).toBeNull();
  });
});

