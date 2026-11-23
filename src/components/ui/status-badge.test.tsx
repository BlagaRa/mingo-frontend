import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { theme } from "@/config/theme";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("renders open as yellowish with a clock icon", () => {
    render(<StatusBadge status="open" />);
    const badge = screen.getByText("Deschisă").closest("span");
    expect(badge).toHaveStyle({ backgroundColor: theme.colors.statusOpen });
    expect(screen.getByTestId("status-icon-open")).toBeInTheDocument();
  });

  it("renders cancelled as red with an x icon", () => {
    render(<StatusBadge status="cancelled" />);
    const badge = screen.getByText("Anulată").closest("span");
    expect(badge).toHaveStyle({ backgroundColor: theme.colors.statusDanger });
    expect(screen.getByTestId("status-icon-cancelled")).toBeInTheDocument();
  });

  it("renders confirmed with a check icon", () => {
    render(<StatusBadge status="confirmed" />);
    expect(screen.getByText("Confirmată")).toBeInTheDocument();
    expect(screen.getByTestId("status-icon-confirmed")).toBeInTheDocument();
  });

  it("renders pending as Neconfirmată with a pending icon", () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText("Neconfirmată").closest("span");
    expect(badge).toHaveStyle({ backgroundColor: theme.colors.coralSoft });
    expect(screen.getByTestId("status-icon-pending")).toBeInTheDocument();
  });

  it("renders full with a distinct filled tone", () => {
    render(<StatusBadge status="full" />);
    const badge = screen.getByText("Completă").closest("span");
    expect(badge).toHaveStyle({
      backgroundColor: theme.colors.forestFill,
      color: theme.colors.ivory,
    });
    expect(screen.getByTestId("status-icon-full")).toBeInTheDocument();
  });
});
