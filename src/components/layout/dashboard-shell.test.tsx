import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DashboardShell } from "./dashboard-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin",
}));

vi.mock("@/lib/demo-session", () => ({
  useDemoSession: () => ({ setRole: vi.fn() }),
}));

describe("DashboardShell", () => {
  it("admin mode drops Utilizatori and keeps core CRM links", () => {
    render(
      <DashboardShell mode="admin">
        <p>child</p>
      </DashboardShell>,
    );
    expect(screen.queryByRole("link", { name: "Utilizatori" })).toBeNull();
    expect(screen.getByRole("link", { name: "Membri" })).toHaveAttribute(
      "href",
      "/admin/membri",
    );
    expect(screen.getByRole("link", { name: "Terenuri" })).toHaveAttribute(
      "href",
      "/admin/terenuri",
    );
    expect(screen.getByRole("link", { name: "Rezervări" })).toHaveAttribute(
      "href",
      "/admin/rezervari",
    );
  });

  it("owner mode keeps Rezervări after Terenuri and drops Calendar and Teren nou", () => {
    render(
      <DashboardShell mode="owner">
        <p>child</p>
      </DashboardShell>,
    );
    expect(screen.getByRole("link", { name: "Rezervări" })).toHaveAttribute(
      "href",
      "/proprietar/rezervari",
    );
    expect(screen.queryByRole("link", { name: "Calendar" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Teren nou" })).toBeNull();
    expect(screen.getByRole("link", { name: "Abonament" })).toHaveAttribute(
      "href",
      "/proprietar/abonamente",
    );
    expect(screen.getByRole("link", { name: "← Site public" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Deschide meniul" }),
    ).toBeInTheDocument();
    const nav = screen.getByRole("navigation", { name: "Dashboard" });
    const hrefs = [...nav.querySelectorAll("a")].map((a) =>
      a.getAttribute("href"),
    );
    const terenuri = hrefs.indexOf("/proprietar/terenuri");
    const rezervari = hrefs.indexOf("/proprietar/rezervari");
    expect(terenuri).toBeGreaterThanOrEqual(0);
    expect(rezervari).toBe(terenuri + 1);
  });
});

