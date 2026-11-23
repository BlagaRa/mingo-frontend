import { beforeEach, describe, expect, it, vi } from "vitest";

const redirect = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => redirect(...args),
}));

describe("AdminUtilizatoriPage", () => {
  beforeEach(() => {
    redirect.mockClear();
  });

  it("redirects to /admin/membri", async () => {
    const { default: Page } = await import("./page");
    Page();
    expect(redirect).toHaveBeenCalledWith("/admin/membri");
  });
});
