"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { theme } from "@/config/theme";
import { useScrollFade } from "./use-scroll-fade";

export type ComboboxOption = { value: string; label: string };

type ComboboxProps = {
  label: string;
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  emptyLabel?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  className?: string;
  size?: "sm" | "md";
  onValueChange?: (value: string) => void;
};

export function Combobox({
  label,
  options,
  value,
  defaultValue = "",
  emptyLabel,
  disabled = false,
  name,
  id,
  className = "",
  size = "md",
  onValueChange,
}: ComboboxProps) {
  const reactId = useId();
  const fieldId = id ?? name ?? reactId;
  const listId = `${fieldId}-list`;
  const searchId = `${fieldId}-search`;
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [internal, setInternal] = useState(defaultValue);
  const selected = value ?? internal;
  const { scrolling, onScroll } = useScrollFade();
  const compact = size === "sm";

  const allOptions = useMemo(() => {
    if (!emptyLabel) return options;
    return [{ value: "", label: emptyLabel }, ...options];
  }, [emptyLabel, options]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allOptions;
    return allOptions.filter((option) =>
      option.label.toLowerCase().includes(q),
    );
  }, [allOptions, query]);

  const selectedLabel =
    allOptions.find((option) => option.value === selected)?.label ??
    emptyLabel ??
    "Alege";

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function commit(next: string) {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
    setOpen(false);
    setQuery("");
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function onSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setQuery("");
      return;
    }
    if (event.key === "Enter" && filtered[0]) {
      event.preventDefault();
      commit(filtered[0].value);
    }
  }

  const triggerPad = compact ? "px-2.5 py-1.5 text-[0.8125rem]" : "px-3.5 py-2.5 text-[0.95rem]";
  const optionPad = compact ? "px-2.5 py-1.5 text-[0.8125rem]" : "px-3.5 py-2.5 text-[0.95rem]";

  return (
    <div
      ref={rootRef}
      className={`relative flex flex-col gap-1.5 text-[var(--type-small)] ${className}`}
    >
      <span
        className={`font-medium text-[var(--color-ivory)] ${compact ? "text-[0.75rem]" : ""}`}
        id={`${fieldId}-label`}
      >
        {label}
      </span>
      {name ? <input type="hidden" name={name} value={selected} /> : null}
      <button
        type="button"
        id={fieldId}
        role="combobox"
        aria-labelledby={`${fieldId}-label`}
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((current) => !current);
          setQuery("");
        }}
        onKeyDown={onTriggerKeyDown}
        className={`flex w-full items-center justify-between rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-forest)_14%,transparent)] bg-[var(--color-ivory)] text-left text-[var(--color-forest)] shadow-[0_1px_2px_color-mix(in_srgb,var(--color-forest)_8%,transparent)] transition-[border-color,box-shadow] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] disabled:cursor-not-allowed disabled:opacity-45 ${triggerPad}`}
        style={{
          borderColor: open ? theme.colors.coral : undefined,
        }}
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          aria-hidden
          viewBox="0 0 12 8"
          width={compact ? 10 : 12}
          height={compact ? 7 : 8}
          className="shrink-0 transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)]"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: theme.colors.forest,
          }}
        >
          <path
            d="M1.5 1.75L6 6.25L10.5 1.75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-30 overflow-hidden rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] bg-[var(--color-ivory)] shadow-[0_12px_28px_color-mix(in_srgb,var(--color-forest)_18%,transparent)]">
          <div className="border-b border-[color-mix(in_srgb,var(--color-forest)_10%,transparent)] p-1.5">
            <input
              ref={searchRef}
              id={searchId}
              role="searchbox"
              aria-label={`Caută în ${label}`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Caută…"
              className={`w-full rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] bg-[var(--color-ivory)] text-[var(--color-forest)] outline-none focus-visible:border-[var(--color-coral)] ${compact ? "px-2 py-1.5 text-[0.8125rem]" : "px-3 py-2 text-[0.95rem]"}`}
            />
          </div>
          <ul
            id={listId}
            role="listbox"
            aria-labelledby={`${fieldId}-label`}
            onScroll={onScroll}
            className={`mingo-scroll max-h-56 overflow-auto py-1 ${scrolling ? "is-scrolling" : ""}`}
          >
            {filtered.length === 0 ? (
              <li
                className="mx-2 my-1 rounded-[var(--radius-sm)] px-3.5 py-4 text-center"
                role="status"
              >
                <p className="font-medium text-[var(--color-forest)]">
                  Niciun rezultat
                </p>
                <p className="mt-1 text-[var(--type-small)] text-[var(--color-coral)]">
                  Încearcă alt cuvânt sau șterge căutarea.
                </p>
              </li>
            ) : (
              filtered.map((option) => {
                const active = option.value === selected;
                return (
                  <li key={`${option.value}-${option.label}`} role="none">
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => commit(option.value)}
                      className={`flex w-full text-left font-medium transition-colors duration-[var(--motion-press-ms)] ease-[var(--ease-out)] ${optionPad}`}
                      style={{
                        backgroundColor: active
                          ? theme.colors.coral
                          : "transparent",
                        color: active
                          ? theme.colors.onCoral
                          : theme.colors.forest,
                      }}
                      onMouseEnter={(event) => {
                        if (active) return;
                        event.currentTarget.style.backgroundColor =
                          "color-mix(in srgb, var(--color-coral) 18%, transparent)";
                      }}
                      onMouseLeave={(event) => {
                        if (active) return;
                        event.currentTarget.style.backgroundColor =
                          "transparent";
                      }}
                    >
                      {option.label}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
