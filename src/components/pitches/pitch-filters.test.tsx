import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams(""),
}));

import { PitchFilters } from "./pitch-filters";
import { theme } from "@/config/theme";

describe("PitchFilters", () => {
  it("keeps advanced filters collapsed until Mai multe filtre is opened", async () => {
    const user = userEvent.setup();
    replace.mockClear();
    render(<PitchFilters />);

    expect(screen.getByRole("heading", { name: "Filtre" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Sintetic" }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Mai multe filtre" }),
    );
    expect(screen.getByRole("button", { name: "Sintetic" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sintetic" }));
    expect(replace).toHaveBeenCalledWith("/terenuri?surface=Sintetic", {
      scroll: false,
    });

    const toate = screen.getByRole("button", { name: "Toate" });
    expect(toate).toHaveStyle({ backgroundColor: theme.colors.coral });
    expect(toate).toHaveStyle({ color: theme.colors.forest });
  });
});
