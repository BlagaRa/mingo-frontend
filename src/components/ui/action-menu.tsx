"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { theme } from "@/config/theme";

export type ActionMenuItem = {
  id: string;
  label: string;
  danger?: boolean;
  onSelect: () => void;
};

type ActionMenuProps = {
  label?: string;
  items: ActionMenuItem[];
};

export function ActionMenu({ label = "Acțiuni", items }: ActionMenuProps) {
  const reactId = useId();
  const menuId = `${reactId}-menu`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function close() {
    setOpen(false);
  }

  function select(item: ActionMenuItem) {
    item.onSelect();
    close();
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
    if (event.key === "Escape" && open) {
      event.preventDefault();
      close();
    }
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  }

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onTriggerKeyDown}
        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-forest)_16%,transparent)] bg-[var(--color-ivory)] text-lg leading-none text-[var(--color-forest)] shadow-[0_1px_2px_color-mix(in_srgb,var(--color-forest)_6%,transparent)] transition-[border-color,box-shadow,transform] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--color-coral)]"
        style={{
          borderColor: open ? theme.colors.coral : undefined,
        }}
      >
        <span aria-hidden>⋯</span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          tabIndex={-1}
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 top-[calc(100%+0.35rem)] z-30 min-w-[10.5rem] overflow-hidden rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-forest)_14%,transparent)] bg-[var(--color-ivory)] py-1 shadow-[0_12px_28px_color-mix(in_srgb,var(--color-forest)_14%,transparent)]"
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={() => select(item)}
              className="flex w-full px-3.5 py-2.5 text-left text-[0.95rem] font-medium transition-colors duration-[var(--motion-press-ms)] ease-[var(--ease-out)]"
              style={{
                color: item.danger ? theme.colors.coral : theme.colors.forest,
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = item.danger
                  ? theme.colors.coralSoft
                  : theme.colors.surfaceMuted;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}