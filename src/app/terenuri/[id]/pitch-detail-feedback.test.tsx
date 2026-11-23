import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { pitches } from "@/lib/mock/queries";

vi.mock("@/lib/mock/schedule", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mock/schedule")>();
  return {
    ...actual,
    availableDays: () => [],
    freeHoursForDay: () => [],
  };
});

vi.mock("@/lib/mock/queries", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mock/queries")>();
  return {
    ...actual,
    getPitch: () => pitches[0],
    bookingsForPitch: () => [],
  };
});

import PitchDetailPage from "./page";

describe("PitchDetailPage feedback", () => {
  it("shows empty states for free hours and open teams", async () => {
    const ui = await PitchDetailPage({
      params: Promise.resolve({ id: pitches[0]!.id }),
    });
    render(ui);
    expect(screen.getByText("Nicio oră liberă")).toBeInTheDocument();
    expect(screen.getByText("Nicio echipă deschisă")).toBeInTheDocument();
  });
});
