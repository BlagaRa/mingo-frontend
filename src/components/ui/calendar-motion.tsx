"use client";

import { type ReactNode, useState } from "react";

export type CalSlideDir = "next" | "prev";

export type CalSlide = {
  dir: CalSlideDir;
  key: number;
};

export function useDaySquash() {
  const [squashDay, setSquashDay] = useState<string | null>(null);
  const [squashKey, setSquashKey] = useState(0);

  function triggerSquash(day: string) {
    setSquashDay(day);
    setSquashKey((key) => key + 1);
  }

  function endSquash(day: string) {
    setSquashDay((current) => (current === day ? null : current));
  }

  function squashClass(day: string) {
    return squashDay === day ? "day-select-squash" : "";
  }

  function squashWrapKey(day: string) {
    return squashDay === day ? `${day}-squash-${squashKey}` : day;
  }

  return {
    squashDay,
    squashKey,
    triggerSquash,
    endSquash,
    squashClass,
    squashWrapKey,
  };
}

export function useCalSlide() {
  const [slide, setSlide] = useState<CalSlide | null>(null);

  function beginSlide(dir: CalSlideDir) {
    setSlide({ dir, key: Date.now() });
  }

  function endSlide() {
    setSlide(null);
  }

  return { slide, beginSlide, endSlide };
}

/** Horizontal shift track: old pane out, new pane in (with overshoot CSS). */
export function CalendarShift({
  slide,
  onSlideEnd,
  current,
  outgoing,
}: {
  slide: CalSlide | null;
  onSlideEnd: () => void;
  current: ReactNode;
  outgoing?: ReactNode;
}) {
  const panes =
    slide?.dir === "prev" && outgoing
      ? [current, outgoing]
      : slide && outgoing
        ? [outgoing, current]
        : [current];

  return (
    <div className="week-shift-viewport">
      <div
        key={slide?.key ?? "idle"}
        className={`week-shift-track ${
          slide?.dir === "next"
            ? "week-shift-track-next"
            : slide?.dir === "prev"
              ? "week-shift-track-prev"
              : ""
        }`}
        style={slide ? undefined : { width: "100%" }}
        onAnimationEnd={(event) => {
          if (event.target !== event.currentTarget) return;
          onSlideEnd();
        }}
      >
        {panes.map((pane, index) => (
          <div
            key={index}
            className="week-shift-pane"
            style={slide ? undefined : { width: "100%" }}
          >
            {pane}
          </div>
        ))}
      </div>
    </div>
  );
}
