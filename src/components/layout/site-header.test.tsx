import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./site-header";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/lib/demo-session", () => ({
  useDemoSession: () => ({
    role: "player",
    setRole: vi.fn(),
  }),
}));

describe("SiteHeader auth", () => {
  it("shows Login and Înregistrează-te instead of Intră", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute(
      "href",
      "/autentificare",
    );
    expect(
      screen.getByRole("link", { name: "Înregistrează-te" }),
    ).toHaveAttribute("href", "/inregistrare");
    expect(screen.queryByRole("link", { name: "Intră" })).toBeNull();
  });
});
