import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useScrollFade } from "./use-scroll-fade";

describe("useScrollFade", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("marks scrolling then clears after idle", () => {
    const { result } = renderHook(() => useScrollFade(200));
    expect(result.current.scrolling).toBe(false);
    act(() => {
      result.current.onScroll();
    });
    expect(result.current.scrolling).toBe(true);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.scrolling).toBe(false);
  });
});
