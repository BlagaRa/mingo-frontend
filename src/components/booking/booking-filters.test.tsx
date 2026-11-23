import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingFilters } from "./booking-filters";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams("status=open"),
}));

describe("BookingFilters", () => {
  it("updates status chips without scrolling and can clear filters", async () => {
    const user = userEvent.setup();
    replace.mockClear();
    render(<BookingFilters />);

    expect(screen.getByRole("button", { name: "Deschisă" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Anulată" }));
    expect(replace).toHaveBeenCalledWith("/rezervari?status=cancelled", {
      scroll: false,
    });

    await user.click(screen.getByRole("button", { name: "Resetează" }));
    expect(replace).toHaveBeenCalledWith("/rezervari", { scroll: false });
  });
});
