"use client";

import { useEffect, useId, useState } from "react";
import { normalizeTimeInput, parseTimeInput } from "@/lib/mock/time-input";

type TimeFieldProps = {
  label: string;
  value: string;
  onCommit: (value: string) => void;
  className?: string;
};

export function TimeField({
  label,
  value,
  onCommit,
  className = "",
}: TimeFieldProps) {
  const id = useId();
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function commit() {
    const parsed = parseTimeInput(draft);
    if (!parsed) {
      setDraft(value);
      return;
    }
    setDraft(parsed);
    if (parsed !== value) onCommit(parsed);
  }

  return (
    <label className={`flex flex-col gap-1 text-sm ${className}`} htmlFor={id}>
      <span className="opacity-70">{label}</span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        placeholder="08:00"
        value={draft}
        onChange={(event) => setDraft(normalizeTimeInput(event.target.value))}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          }
        }}
        className="w-[5.5rem] rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-forest)_14%,transparent)] bg-[var(--color-ivory)] px-2.5 py-2 text-sm tabular-nums text-[var(--color-forest)] outline-none focus-visible:border-[var(--color-coral)]"
        aria-label={label}
      />
    </label>
  );
}
