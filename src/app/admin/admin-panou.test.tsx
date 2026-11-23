import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { users, pitches, bookings } from "@/lib/mock/fixtures";
import AdminPage from "./page";

describe("AdminPage CRM panou", () => {
  it("renders KPI counts, a chart, and recent activity", () => {
    render(<AdminPage />);
    expect(screen.getByText("Membri")).toBeInTheDocument();
    expect(screen.getByText(String(users.length))).toBeInTheDocument();
    expect(screen.getByText("Terenuri")).toBeInTheDocument();
    expect(screen.getByText(String(pitches.length))).toBeInTheDocument();
    expect(screen.getByText("Rezervări")).toBeInTheDocument();
    expect(screen.getByText(String(bookings.length))).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Rezervări pe status" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Activitate recentă")).toBeInTheDocument();
  });
});
