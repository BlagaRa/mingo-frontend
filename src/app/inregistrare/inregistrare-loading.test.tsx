import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => {
    throw new Promise(() => {});
  },
}));

vi.mock("@/lib/demo-session", () => ({
  useDemoSession: () => ({ setRole: vi.fn() }),
}));

import InregistrarePage from "./page";

describe("InregistrarePage loading", () => {
  it("shows a skeleton while search params suspend", () => {
    render(<InregistrarePage />);
    expect(
      screen.getByRole("status", { name: "Se încarcă înregistrarea" }),
    ).toBeInTheDocument();
  });
});
