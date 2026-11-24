import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const push = vi.fn();
let suspend = false;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => {
    if (suspend) throw new Promise(() => {});
    return new URLSearchParams("bookingId=b-1&email=ana@example.com");
  },
}));

const confirmBooking = vi.fn();
vi.mock("@/lib/mock/booking-store", () => ({
  confirmBooking: (id: string) => confirmBooking(id),
}));

import ConfirmareRezervarePage from "./page";

describe("ConfirmareRezervarePage", () => {
  beforeEach(() => {
    push.mockClear();
    confirmBooking.mockClear();
    suspend = false;
  });

  it("shows booking copy with the email, not account signup", () => {
    render(<ConfirmareRezervarePage />);
    expect(
      screen.getByRole("heading", { name: "Confirmă rezervarea" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/ana@example\.com/)).toBeInTheDocument();
  });

  it("confirms the booking with any 6-char code and navigates to it", async () => {
    render(<ConfirmareRezervarePage />);
    await userEvent.type(screen.getByLabelText("Cod din email"), "abc123");
    await userEvent.click(
      screen.getByRole("button", { name: "Confirmă rezervarea" }),
    );
    expect(confirmBooking).toHaveBeenCalledWith("b-1");
    expect(push).toHaveBeenCalledWith("/rezervari/b-1");
  });

  it("rejects a code that is not 6 chars", async () => {
    render(<ConfirmareRezervarePage />);
    await userEvent.type(screen.getByLabelText("Cod din email"), "abc");
    await userEvent.click(
      screen.getByRole("button", { name: "Confirmă rezervarea" }),
    );
    expect(confirmBooking).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByText(/Codul are 6 caractere/)).toBeInTheDocument();
  });

  it("resend shows feedback and stays on the page", async () => {
    render(<ConfirmareRezervarePage />);
    await userEvent.click(screen.getByRole("button", { name: "Retrimite codul" }));
    expect(screen.getByText("Am retrimis codul (demo).")).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
    expect(confirmBooking).not.toHaveBeenCalled();
  });

  it("shows a skeleton while search params suspend", () => {
    suspend = true;
    render(<ConfirmareRezervarePage />);
    expect(
      screen.getByRole("status", { name: "Se încarcă confirmarea rezervării" }),
    ).toBeInTheDocument();
  });
});
