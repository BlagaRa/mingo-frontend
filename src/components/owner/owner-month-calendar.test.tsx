import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { shiftMonth } from "@/lib/mock/schedule";
import { OwnerMonthCalendar } from "./owner-month-calendar";

function Harness({ year, month }: { year: number; month: number }) {
  const [cursor, setCursor] = useState({ year, month });
  return (
    <OwnerMonthCalendar
      year={cursor.year}
      month={cursor.month}
      selectedDay="2026-12-05"
      daysWithBookings={new Set()}
      onSelectDay={() => {}}
      onShiftMonth={(delta) =>
        setCursor((c) => shiftMonth(c.year, c.month, delta))
      }
    />
  );
}

describe("OwnerMonthCalendar", () => {
  it("renders month title, weekday labels and one button per day", () => {
    render(
      <OwnerMonthCalendar
        year={2026}
        month={10}
        selectedDay="2026-11-24"
        daysWithBookings={new Set()}
        onSelectDay={() => {}}
        onShiftMonth={() => {}}
      />,
    );
    expect(
      screen.getByRole("heading", { name: /noiembrie 2026/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Lu")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /noiembrie/i })).toHaveLength(30);
  });

  it("marks selected day and days with bookings", () => {
    render(
      <OwnerMonthCalendar
        year={2026}
        month={10}
        selectedDay="2026-11-24"
        daysWithBookings={new Set(["2026-11-25"])}
        onSelectDay={() => {}}
        onShiftMonth={() => {}}
      />,
    );
    const selected = screen.getByRole("button", { name: /24 noiembrie/i });
    expect(selected).toHaveAttribute("aria-pressed", "true");
    const marked = screen.getByRole("button", { name: /25 noiembrie.*rezervări/i });
    expect(marked).toHaveAttribute("aria-pressed", "false");
    expect(screen.getAllByTestId("booking-dot")).toHaveLength(1);
  });

  it("selects any day, including days without bookings", async () => {
    const user = userEvent.setup();
    const onSelectDay = vi.fn();
    render(
      <OwnerMonthCalendar
        year={2026}
        month={10}
        selectedDay="2026-11-24"
        daysWithBookings={new Set()}
        onSelectDay={onSelectDay}
        onShiftMonth={() => {}}
      />,
    );
    await user.click(screen.getByRole("button", { name: /10 noiembrie/i }));
    expect(onSelectDay).toHaveBeenCalledWith("2026-11-10");
  });

  it("asks to shift month with -1 and +1", async () => {
    const user = userEvent.setup();
    const onShiftMonth = vi.fn();
    render(
      <OwnerMonthCalendar
        year={2026}
        month={10}
        selectedDay="2026-11-24"
        daysWithBookings={new Set()}
        onSelectDay={() => {}}
        onShiftMonth={onShiftMonth}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Luna anterioară" }));
    await user.click(screen.getByRole("button", { name: "Luna următoare" }));
    expect(onShiftMonth).toHaveBeenNthCalledWith(1, -1);
    expect(onShiftMonth).toHaveBeenNthCalledWith(2, 1);
  });

  it("rolls from december 2026 to ianuarie 2027 and still renders cells", async () => {
    const user = userEvent.setup();
    render(<Harness year={2026} month={11} />);
    expect(
      screen.getByRole("heading", { name: /decembrie 2026/i }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Luna următoare" }));
    expect(
      screen.getByRole("heading", { name: /ianuarie 2027/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /ianuarie/i })).toHaveLength(31);
  });
});
