"use client";

import { useCallback, useRef, useState } from "react";

/** Adds `is-scrolling` while the user scrolls; fades out after idle. */
export function useScrollFade(idleMs = 700) {
  const [scrolling, setScrolling] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onScroll = useCallback(() => {
    setScrolling(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setScrolling(false), idleMs);
  }, [idleMs]);

  return { scrolling, onScroll };
}
