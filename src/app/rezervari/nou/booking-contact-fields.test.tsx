import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams("pitchId=p-1"),
}));

import { listBookings, resetBookingStore } from "@/lib/mock/booking-store";
import RezervareNouaPage from "./page";

async function pickDayAndHour(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole("button", { name: "Alege 2026-11-24" }));
  const hour = screen
    .getAllByRole("button")
    .find((button) => /^\d{2}:\d{2}$/.test(button.textContent ?? ""));
  await user.click(hour!);
}

async function fillContact(
  user: ReturnType<typeof userEvent.setup>,
  phone: string,
) {
  await user.type(screen.getByLabelText("Nume"), "Ana Pop");
  await user.type(screen.getByLabelText("Email"), "ana@example.com");
  await user.type(screen.getByLabelText("Telefon"), phone);
}

describe("RezervareNouaPage contact fields", () => {
  beforeEach(() => {
    push.mockClear();
    resetBookingStore();
  });

  it("blocks submit and shows an error for an invalid phone", async () => {
    const user = userEvent.setup();
    const before = listBookings().length;
    render(<RezervareNouaPage />);
    await pickDayAndHour(user);
    await fillContact(user, "0612345678");
    await user.click(screen.getByRole("button", { name: "Confirmă" }));

    expect(screen.getByText("Introdu un telefon valid (07…)")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
    expect(listBookings()).toHaveLength(before);
  });

  it("saves a pending booking and goes to the confirm route", async () => {
    const user = userEvent.setup();
    const before = listBookings().length;
    render(<RezervareNouaPage />);
    await pickDayAndHour(user);
    await fillContact(user, "0712 345 678");
    await user.click(screen.getByRole("button", { name: "Confirmă" }));

    const created = listBookings().slice(before);
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject({
      pitchId: "p-1",
      status: "pending",
      contactName: "Ana Pop",
      contactEmail: "ana@example.com",
      contactPhone: "0712 345 678",
    });
    expect(push).toHaveBeenCalledWith(
      `/confirmare-rezervare?bookingId=${created[0].id}&email=${encodeURIComponent("ana@example.com")}`,
    );
  });
});
