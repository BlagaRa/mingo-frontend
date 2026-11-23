import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => {
    throw new Promise(() => {});
  },
}));

vi.mock("@/lib/demo-session", () => ({
  useDemoSession: () => ({
    setEmailVerified: vi.fn(),
    role: "player",
  }),
}));

import ConfirmareEmailPage from "./page";

describe("ConfirmareEmailPage loading", () => {
  it("shows a skeleton while search params suspend", () => {
    render(<ConfirmareEmailPage />);
    expect(
      screen.getByRole("status", { name: "Se încarcă confirmarea" }),
    ).toBeInTheDocument();
  });
});
