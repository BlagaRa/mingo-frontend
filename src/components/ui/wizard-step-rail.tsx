"use client";

import { useEffect, useState } from "react";

/** Keep stroke clear of point radius so it never sits inside the ring */
const LINE_INSET = "0.7rem";
const FILL_MS = 900;

type WizardStepRailProps = {
  steps: readonly string[];
  index: number;
  onSelect: (next: number) => void;
  /** dark = ivory labels on forest pages; light = forest labels on ivory cards */
  tone?: "dark" | "light";
  className?: string;
  "aria-label"?: string;
};

export function WizardStepRail({
  steps,
  index,
  onSelect,
  tone = "dark",
  className = "",
  "aria-label": ariaLabel = "Progres",
}: WizardStepRailProps) {
  const count = steps.length;
  const start = 50 / count;
  const span = 100 - 100 / count;
  const fillRatio = count === 1 || index <= 0 ? 0 : index / (count - 1);
  const light = tone === "light";

  /** How far coral dots are lit — lags behind `index` until the bar arrives */
  const [litIndex, setLitIndex] = useState(index);

  useEffect(() => {
    if (index <= litIndex) {
      setLitIndex(index);
      return;
    }
    const reduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLitIndex(index);
      return;
    }
    const timer = window.setTimeout(() => setLitIndex(index), FILL_MS);
    return () => window.clearTimeout(timer);
  }, [index, litIndex]);

  return (
    <ol
      aria-label={ariaLabel}
      className={`relative grid ${className}`}
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        className="absolute top-[0.4rem] h-[2px] rounded-full"
        style={{
          left: `calc(${start}% + ${LINE_INSET})`,
          width: `calc(${span}% - ${LINE_INSET} * 2)`,
          backgroundColor: light
            ? "color-mix(in srgb, var(--color-forest) 16%, transparent)"
            : "color-mix(in srgb, var(--color-ivory) 28%, transparent)",
        }}
      />
      <span
        aria-hidden="true"
        className="wizard-line absolute top-[0.4rem] h-[2px] rounded-full bg-[var(--color-coral)]"
        style={{
          left: `calc(${start}% + ${LINE_INSET})`,
          width:
            fillRatio === 0
              ? 0
              : `calc(${fillRatio * span}% - ${LINE_INSET})`,
        }}
      />
      {steps.map((label, itemIndex) => {
        const reached = itemIndex <= litIndex;
        const state =
          itemIndex < index
            ? "done"
            : itemIndex === index && reached
              ? "current"
              : itemIndex === index
                ? "pending"
                : "wait";
        const labelActive = itemIndex <= index;
        return (
          <li key={label} className="relative z-[1] flex justify-center">
            <button
              type="button"
              disabled={itemIndex > index}
              aria-current={itemIndex === index ? "step" : undefined}
              onClick={() => {
                if (itemIndex < index) onSelect(itemIndex);
              }}
              className="flex flex-col items-center gap-2 bg-transparent disabled:cursor-default"
            >
              <span
                className={`wizard-point wizard-point-${state === "pending" ? "wait" : state}`}
                style={
                  state === "wait" || state === "pending"
                    ? {
                        borderColor: light
                          ? "color-mix(in srgb, var(--color-forest) 28%, transparent)"
                          : "color-mix(in srgb, var(--color-ivory) 42%, transparent)",
                        /* Opaque fill so the progress track never shows through the ring */
                        backgroundColor: light
                          ? "var(--color-ivory)"
                          : "var(--color-forest)",
                      }
                    : undefined
                }
              />
              <span
                className={`text-xs font-semibold sm:text-sm ${
                  light
                    ? labelActive
                      ? "text-[var(--color-forest)]"
                      : "text-[var(--color-forest)] opacity-40"
                    : labelActive
                      ? "text-[var(--color-ivory)]"
                      : "text-[var(--color-ivory)] opacity-45"
                }`}
              >
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
