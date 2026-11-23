import { describe, expect, it, vi } from "vitest";

const redirect = vi.fn(() => {
  throw new Error("NEXT_REDIRECT");
});

vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => redirect(...args),
}));

import OwnerCalendarRedirectPage from "./page";

describe("OwnerCalendarRedirectPage", () => {
  it("redirects to rezervări", () => {
    expect(() => OwnerCalendarRedirectPage()).toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith("/proprietar/rezervari");
  });
});
