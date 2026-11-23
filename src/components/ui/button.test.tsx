import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";
import { theme } from "@/config/theme";

describe("Button", () => {
  it("renders a coral accent button with forest label color", () => {
    render(<Button variant="accent">Rezervă</Button>);
    const button = screen.getByRole("button", { name: "Rezervă" });
    expect(button).toHaveStyle({
      backgroundColor: theme.colors.coral,
      color: theme.colors.onCoral,
    });
  });

  it("renders a green forest fill with ivory label, not black on black", () => {
    render(<Button variant="primary">Intră</Button>);
    const button = screen.getByRole("button", { name: "Intră" });
    expect(button).toHaveStyle({
      backgroundColor: theme.colors.forestFill,
      color: theme.colors.onForest,
    });
    expect(theme.colors.onForest).toBe(theme.colors.ivory);
  });

  it("can render as a child link", () => {
    render(
      <Button asChild variant="ghost">
        <a href="/terenuri">Terenuri</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Terenuri" })).toHaveAttribute(
      "href",
      "/terenuri",
    );
  });
});
