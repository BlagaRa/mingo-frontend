import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PitchWeekHours } from "./pitch-week-hours";

vi.mock("@/lib/mock/schedule", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mock/schedule")>();
  return {
    ...actual,
    todayISO: () => "2026-11-24",
    freeHoursForDay: (pitchId: string, day: string) => {
      if (pitchId !== "p-1") return [];
      if (day === "2026-11-24") {
        return [
          {
            id: "s-today",
            pitchId: "p-1",
            startsAt: "2026-11-24T18:00:00+02:00",
            endsAt: "2026-11-24T19:00:00+02:00",
          },
        ];
      }
      if (day === "2026-11-26") {
        return [
          {
            id: "s-thu",
            pitchId: "p-1",
            startsAt: "2026-11-26T17:00:00+02:00",
            endsAt: "2026-11-26T18:00:00+02:00",
          },
        ];
      }
      return [];
    },
  };
});

describe("PitchWeekHours", () => {
  it("preselects today when available and shows only that day's hours", () => {
    render(
      <PitchWeekHours
        pitchId="p-1"
        availableDays={["2026-11-24", "2026-11-26"]}
      />,
    );
    expect(screen.getByRole("button", { name: "Alege 2026-11-24" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("link", { name: "18:00" })).toHaveAttribute(
      "href",
      "/rezervari/nou?pitchId=p-1&slotId=s-today",
    );
    expect(screen.queryByRole("link", { name: "17:00" })).not.toBeInTheDocument();
  });

  it("switches hours when another available day is selected", async () => {
    const user = userEvent.setup();
    render(
      <PitchWeekHours
        pitchId="p-1"
        availableDays={["2026-11-24", "2026-11-26"]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Alege 2026-11-26" }));
    expect(screen.getByRole("link", { name: "17:00" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "18:00" })).not.toBeInTheDocument();
  });

  it("falls back to the first available day when today has no slots", () => {
    render(
      <PitchWeekHours
        pitchId="p-1"
        availableDays={["2026-11-26"]}
      />,
    );
    expect(screen.getByRole("button", { name: "Alege 2026-11-26" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("link", { name: "17:00" })).toBeInTheDocument();
  });
});
