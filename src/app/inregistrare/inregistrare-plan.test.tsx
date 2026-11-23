import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const searchState = vi.hoisted(() => ({
  query: "role=owner&plan=club",
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: searchState.push }),
  useSearchParams: () => new URLSearchParams(searchState.query),
}));

vi.mock("@/lib/demo-session", () => ({
  useDemoSession: () => ({ setRole: vi.fn() }),
}));

import InregistrarePage from "./page";

describe("InregistrarePage plan", () => {
  it("shows selected Club plan and owner role default", () => {
    searchState.query = "role=owner&plan=club";
    render(<InregistrarePage />);
    expect(screen.getByText(/Plan selectat: Club/)).toBeInTheDocument();
    expect(screen.getByText(/149 RON/)).toBeInTheDocument();
  });

  it("hides plan summary for unknown plan id", () => {
    searchState.query = "plan=nope";
    render(<InregistrarePage />);
    expect(screen.queryByText(/Plan selectat:/)).toBeNull();
  });

  it("defaults role to owner when plan is present without role", () => {
    searchState.query = "plan=club";
    render(<InregistrarePage />);
    expect(screen.getByText(/Plan selectat: Club/)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent(
      "Proprietar de teren",
    );
  });

  it("keeps plan on confirmare-email after submit", async () => {
    searchState.query = "role=owner&plan=club";
    searchState.push.mockClear();
    const user = userEvent.setup();
    render(<InregistrarePage />);
    await user.type(screen.getByLabelText("Nume"), "Ana");
    await user.type(screen.getByLabelText("Email"), "ana@example.com");
    await user.click(screen.getByRole("button", { name: "Creează cont" }));
    expect(searchState.push).toHaveBeenCalledWith(
      "/confirmare-email?email=ana%40example.com&plan=club",
    );
  });
});
