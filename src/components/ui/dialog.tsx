"use client";

import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { Button } from "./button";

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
  tone?: "default" | "danger";
};

export function Dialog({
  open,
  title,
  description,
  confirmLabel = "Confirmă",
  cancelLabel = "Anulează",
  onConfirm,
  onClose,
  children,
  tone = "default",
}: DialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[color-mix(in_srgb,var(--color-forest)_72%,transparent)] p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="w-full max-w-md rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_18%,transparent)] bg-[var(--color-surface-muted)] p-5 shadow-[0_12px_32px_color-mix(in_srgb,var(--color-ivory)_18%,transparent)] origin-center"
      >
        <h2
          id={titleId}
          className="text-[var(--type-h3)] font-semibold text-[var(--color-ivory)]"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-[var(--type-small)] text-[var(--color-coral)]">
            {description}
          </p>
        ) : null}
        {children ? (
          <div className="mt-4 text-[var(--color-ivory)]">{children}</div>
        ) : null}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === "danger" ? "accent" : "primary"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
