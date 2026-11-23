import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { listBookings, resetBookingStore } from "@/lib/mock/booking-store";
import { getPitch } from "@/lib/mock/queries";
import OwnerCalendarPage from "./page";

type User = ReturnType<typeof userEvent.setup>;

async function openForm(user: User) {
  await user.click(screen.getByRole("button", { name: "Rezervare nouă" }));
  return screen.getByRole("form", { name: "Rezervare nouă" });
}

async function fill(user: User, form: HTMLElement, phone: string) {
  await user.type(within(form).getByLabelText("Nume"), "Ion Vasile");
  await user.type(within(form).getByLabelText("Email"), "ion@example.com");
  await user.type(within(form).getByLabelText("Telefon"), phone);
}

describe("Owner creates a booking from the calendar", () => {
  beforeEach(() => resetBookingStore());

  it("saves a confirmed booking with contact and shows it in the day list", async () => {
    const user = userEvent.setup();
    render(<OwnerCalendarPage />);
    const form = await openForm(user);
    await fill(user, form, "0712 345 678");
    await user.click(within(form).getByRole("button", { name: "Salvează" }));

    expect(screen.queryByRole("form", { name: "Rezervare nouă" })).toBeNull();
    const rows = screen.getAllByTestId("day-booking");
    expect(rows).toHaveLength(4);
    const row = rows.find((r) => within(r).queryByText("ion@example.com"))!;
    expect(within(row).getByText("19:00")).toBeInTheDocument();
    expect(within(row).getByText("Confirmată")).toBeInTheDocument();
    expect(within(row).getByText("0712 345 678")).toBeInTheDocument();
    expect(listBookings().at(-1)).toMatchObject({
      pitchId: "p-1",
      slotId: "s-2",
      status: "confirmed",
      contactName: "Ion Vasile",
      contactEmail: "ion@example.com",
      contactPhone: "0712 345 678",
    });
  });

  it("blocks an invalid phone and shows an error", async () => {
    const user = userEvent.setup();
    render(<OwnerCalendarPage />);
    const before = listBookings().length;
    const form = await openForm(user);
    await fill(user, form, "0612345678");
    await user.click(within(form).getByRole("button", { name: "Salvează" }));

    expect(screen.getByText("Introdu un telefon valid (07…)")).toBeInTheDocument();
    expect(listBookings()).toHaveLength(before);
    await user.type(within(form).getByLabelText(/^Telefon/), "1");
    expect(screen.queryByText("Introdu un telefon valid (07…)")).toBeNull();
  });

  it("lets the owner pick a freed hour", async () => {
    const user = userEvent.setup();
    render(<OwnerCalendarPage />);
    const first = screen.getAllByTestId("day-booking")[0]!;
    await user.click(within(first).getByRole("button", { name: "Acțiuni" }));
    await user.click(screen.getByRole("menuitem", { name: "Anulează" }));
    const form = await openForm(user);
    await user.click(within(form).getByRole("combobox", { name: "Ora" }));
    await user.click(screen.getByRole("option", { name: "18:00" }));
    await fill(user, form, "0712345678");
    await user.click(within(form).getByRole("button", { name: "Salvează" }));

    expect(listBookings().at(-1)).toMatchObject({ pitchId: "p-1", slotId: "s-1" });
  });

  it("only offers the filtered pitch", async () => {
    const user = userEvent.setup();
    render(<OwnerCalendarPage />);
    const rows = screen.getAllByTestId("day-booking");
    const name = within(rows[0]!).getByTestId("booking-pitch").textContent!;
    await user.click(screen.getByRole("button", { name }));
    await openForm(user);
    await user.click(screen.getByRole("combobox", { name: "Teren" }));
    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("explains when the chosen pitch has no free hour and blocks saving", async () => {
    const user = userEvent.setup();
    render(<OwnerCalendarPage />);
    const form = await openForm(user);
    await user.click(within(form).getByRole("combobox", { name: "Teren" }));
    await user.click(screen.getByRole("option", { name: getPitch("p-8")!.name }));
    expect(within(form).getByText("Nicio oră liberă pe terenul ales")).toBeInTheDocument();
    expect(within(form).getByRole("button", { name: "Salvează" })).toBeDisabled();
  });

  it("closes the form with Renunță", async () => {
    const user = userEvent.setup();
    render(<OwnerCalendarPage />);
    const form = await openForm(user);
    await user.click(within(form).getByRole("button", { name: "Renunță" }));
    expect(screen.queryByRole("form", { name: "Rezervare nouă" })).toBeNull();
  });
});
