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

  it("renders coral primary key buttons with forest label", () => {
    render(<Button variant="primary">Intră</Button>);
    const button = screen.getByRole("button", { name: "Intră" });
    expect(button).toHaveStyle({
      backgroundColor: theme.colors.coral,
      color: theme.colors.onCoral,
    });
    expect(theme.colors.onCoral).toBe(theme.colors.forest);
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
