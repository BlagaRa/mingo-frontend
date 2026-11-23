import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingCalendar } from "./booking-calendar";

describe("BookingCalendar", () => {
  it("shows only available days and selects one", async () => {
    const user = userEvent.setup();
    const onSelectDay = vi.fn();
    render(
      <BookingCalendar
        availableDays={["2026-11-24", "2026-11-30", "2026-12-03"]}
        selectedDay=""
        onSelectDay={onSelectDay}
      />,
    );

    expect(screen.getByRole("button", { name: "Alege 2026-11-24" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Alege 2026-11-30" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "2026-11-25 indisponibil" }),
    ).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Alege 2026-11-24" }));
    expect(onSelectDay).toHaveBeenCalledWith("2026-11-24");
  });
});
