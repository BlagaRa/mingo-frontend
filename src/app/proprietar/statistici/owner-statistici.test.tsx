import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DEMO_OWNER_ID } from "@/lib/mock/demo";
import { ownerBookingStats } from "@/lib/mock/queries";
import OwnerStatsPage from "./page";

describe("OwnerStatsPage", () => {
  it("puts period filter buttons under the pitch filter", () => {
    render(<OwnerStatsPage />);
    expect(screen.getByRole("combobox", { name: "Teren" })).toBeInTheDocument();
    const group = screen.getByRole("group", { name: "Perioadă" });
    expect(group.compareDocumentPosition(screen.getByRole("combobox", { name: "Teren" }))).toBe(
      Node.DOCUMENT_POSITION_PRECEDING,
    );
    expect(
      screen.getByRole("button", { name: "Azi" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Săptămâna asta" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Luna asta" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Calendar" }),
    ).toBeInTheDocument();
  });

  it("shows date inputs when choosing calendar", async () => {
    const user = userEvent.setup();
    render(<OwnerStatsPage />);
    await user.click(screen.getByRole("button", { name: "Calendar" }));
    expect(screen.getByLabelText("De la")).toHaveAttribute("type", "date");
    expect(screen.getByLabelText("Până la")).toHaveAttribute("type", "date");
  });

  it("filters totals when a pitch is selected on a wide range", async () => {
    const user = userEvent.setup();
    const stats = ownerBookingStats(DEMO_OWNER_ID);
    const pitch = stats.byPitch.find((entry) => entry.count > 0)!;
    render(<OwnerStatsPage />);
    await user.click(screen.getByRole("button", { name: "Calendar" }));
    fireEvent.change(screen.getByLabelText("De la"), {
      target: { value: "2020-01-01" },
    });
    fireEvent.change(screen.getByLabelText("Până la"), {
      target: { value: "2030-12-31" },
    });
    const totalBefore = screen.getByTestId("stat-total").textContent;
    await user.click(screen.getByRole("combobox", { name: "Teren" }));
    await user.click(screen.getByRole("option", { name: pitch.pitch.name }));
    expect(screen.getByTestId("stat-total")).toHaveTextContent(
      String(pitch.count),
    );
    expect(screen.getByTestId("stat-total").textContent).not.toBe(totalBefore);
  });
});
