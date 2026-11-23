import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let query = "pitchId=p-1";
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(query),
}));

import { resetBookingStore } from "@/lib/mock/booking-store";
import { resetProgramStore } from "@/lib/mock/program-store";
import { resetSlotStore, setDayClosed } from "@/lib/mock/slot-store";
import RezervareNouaPage from "./page";

describe("RezervareNouaPage taken slots", () => {
  beforeEach(() => {
    query = "pitchId=p-1";
    resetProgramStore();
    resetSlotStore();
    resetBookingStore();
  });

  it("does not offer an hour already held by another booking", async () => {
    const user = userEvent.setup();
    render(<RezervareNouaPage />);
    await user.click(
      await screen.findByRole("button", { name: "Alege 2026-11-24" }),
    );
    expect(screen.getByRole("button", { name: "19:00" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "18:00" })).toBeNull();
  });

  it("says the hours are taken when every open slot of the day is booked", async () => {
    query = "pitchId=p-8";
    setDayClosed("p-8", "2026-11-24", true);
    const user = userEvent.setup();
    render(<RezervareNouaPage />);
    await user.click(
      await screen.findByRole("button", { name: "Alege 2026-11-24" }),
    );
    expect(screen.getByText("Nicio oră liberă")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "20:00" })).toBeNull();
    expect(screen.getByRole("button", { name: "Confirmă" })).toBeDisabled();
  });
});
