import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { resetBookingStore } from "@/lib/mock/booking-store";
import OwnerCalendarPage from "./page";

describe("OwnerCalendarPage", () => {
  beforeEach(() => {
    resetBookingStore();
  });

  it("shows a month calendar and the first booking day with time, pitch, status and contact", () => {
    render(<OwnerCalendarPage />);
    expect(
      screen.getByRole("heading", { name: /noiembrie 2026/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /24 noiembrie.*rezervări/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    const rows = screen.getAllByTestId("day-booking");
    expect(rows).toHaveLength(3);
    expect(within(rows[0]!).getByText("18:00")).toBeInTheDocument();
    expect(within(rows[0]!).getByText("Deschisă")).toBeInTheDocument();
    expect(within(rows[0]!).getByText("andrei@example.com")).toBeInTheDocument();
    expect(within(rows[0]!).getByText("0721123456")).toBeInTheDocument();
    expect(within(rows[1]!).getByText("19:00")).toBeInTheDocument();
    expect(within(rows[1]!).getByText("Anulată")).toBeInTheDocument();
  });

  it("shows empty state for a day without bookings", async () => {
    const user = userEvent.setup();
    render(<OwnerCalendarPage />);
    await user.click(screen.getByRole("button", { name: /, 10 noiembrie/i }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Nicio rezervare în această zi",
    );
    expect(screen.queryAllByTestId("day-booking")).toHaveLength(0);
  });

  it("filters the day panel by pitch and resets with Toate terenurile", async () => {
    const user = userEvent.setup();
    render(<OwnerCalendarPage />);
    const rows = screen.getAllByTestId("day-booking");
    const firstPitch = within(rows[0]!).getByTestId("booking-pitch").textContent!;
    await user.click(screen.getByRole("button", { name: firstPitch }));
    expect(screen.getAllByTestId("day-booking")).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: "Toate terenurile" }));
    expect(screen.getAllByTestId("day-booking")).toHaveLength(3);
  });

  it("moves to the next month and selects a day there", async () => {
    const user = userEvent.setup();
    render(<OwnerCalendarPage />);
    await user.click(screen.getByRole("button", { name: "Luna următoare" }));
    expect(
      screen.getByRole("heading", { name: /decembrie 2026/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /, 1 decembrie/i }));
    expect(screen.getAllByTestId("day-booking")).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "Luna anterioară" }));
    expect(
      screen.getByRole("heading", { name: /noiembrie 2026/i }),
    ).toBeInTheDocument();
  });

  it("confirms an open booking from the action menu", async () => {
    const user = userEvent.setup();
    render(<OwnerCalendarPage />);
    const row = screen.getAllByTestId("day-booking")[0]!;
    await user.click(within(row).getByRole("button", { name: "Acțiuni" }));
    await user.click(screen.getByRole("menuitem", { name: "Confirmă" }));
    expect(within(row).getByText("Confirmată")).toBeInTheDocument();
    expect(within(row).queryByText("Deschisă")).toBeNull();
  });

  it("cancels a booking and removes the menu for cancelled rows", async () => {
    const user = userEvent.setup();
    render(<OwnerCalendarPage />);
    const rows = screen.getAllByTestId("day-booking");
    expect(within(rows[1]!).queryByRole("button", { name: "Acțiuni" })).toBeNull();
    await user.click(within(rows[0]!).getByRole("button", { name: "Acțiuni" }));
    await user.click(screen.getByRole("menuitem", { name: "Anulează" }));
    expect(within(rows[0]!).getByText("Anulată")).toBeInTheDocument();
    expect(within(rows[0]!).queryByRole("button", { name: "Acțiuni" })).toBeNull();
  });
});
