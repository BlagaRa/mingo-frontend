import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { resetBookingStore, upsertBooking } from "@/lib/mock/booking-store";

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "b-new" }),
}));

import RezervareDetailPage from "./page";

describe("RezervareDetailPage with a freshly created booking", () => {
  beforeEach(() => resetBookingStore());

  it("finds a booking created in the store, not only in fixtures", () => {
    upsertBooking({
      id: "b-new",
      pitchId: "p-1",
      slotId: "s-2",
      hostId: "u-player",
      playerIds: ["u-player"],
      status: "pending",
      seatsNeeded: 8,
      contactName: "Ion",
      contactEmail: "ion@example.com",
      contactPhone: "0712345678",
    });
    render(<RezervareDetailPage />);
    expect(screen.queryByText("Rezervarea nu e aici")).toBeNull();
    expect(screen.getByText("Neconfirmată")).toBeInTheDocument();
  });

  it("still shows not-found for an unknown id", () => {
    render(<RezervareDetailPage />);
    expect(screen.getByText("Rezervarea nu e aici")).toBeInTheDocument();
  });
});
