import type { ReactNode } from "react";
import { theme } from "@/config/theme";

type FeedbackProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  /** dark = on forest pages; light = inside ivory cards/panels */
  tone?: "dark" | "light";
};

export function EmptyState({
  title,
  description,
  action,
  className = "",
  tone = "dark",
}: FeedbackProps) {
  const light = tone === "light";
  return (
    <div
      role="status"
      className={`rounded-[var(--radius-md)] px-5 py-8 text-center sm:px-8 sm:py-10 ${className}`}
      style={{
        backgroundColor: light
          ? "color-mix(in srgb, var(--color-forest-fill) 10%, var(--color-ivory))"
          : theme.colors.surfaceMuted,
        boxShadow: light
          ? "inset 0 0 0 1px color-mix(in srgb, var(--color-forest-fill) 18%, transparent)"
          : undefined,
      }}
    >
      <p
        className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
        style={{ color: light ? theme.colors.forest : theme.colors.ivory }}
      >
        {title}
      </p>
      {description ? (
        <p
          className="mx-auto mt-3 max-w-[36ch]"
          style={{
            fontSize: theme.type.body,
            color: light ? theme.colors.forest : theme.colors.coral,
            opacity: light ? 0.72 : 1,
          }}
        >
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title,
  description,
  action,
  className = "",
}: FeedbackProps) {
  return (
    <div
      role="alert"
      className={`rounded-[var(--radius-md)] px-6 py-10 text-center sm:px-10 sm:py-12 ${className}`}
      style={{
        backgroundColor: theme.colors.coralSoft,
      }}
    >
      <p className="font-display text-xl font-semibold tracking-tight text-[var(--color-ivory)] sm:text-2xl">
        {title}
      </p>
      {description ? (
        <p className="mx-auto mt-3 max-w-[36ch] text-[var(--type-body)] text-[var(--color-ivory)]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Skeleton({
  label,
  lines = 3,
  className = "",
}: {
  label: string;
  lines?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label={label}
      aria-busy="true"
      className={`space-y-3 ${className}`}
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          data-testid="skeleton-line"
          className="h-3 animate-pulse rounded-[var(--radius-sm)]"
          style={{
            backgroundColor: theme.colors.surfaceMuted,
            width: `${88 - index * 12}%`,
          }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Se încarcă terenurile"
      aria-busy="true"
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      <span className="sr-only">Se încarcă terenurile</span>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_12%,transparent)] bg-[var(--color-surface-muted)]"
        >
          <div
            className="aspect-[16/10] animate-pulse"
            style={{ backgroundColor: theme.colors.surfaceMuted }}
          />
          <div className="space-y-3 p-4">
            <div
              className="h-4 w-2/3 animate-pulse rounded-[var(--radius-sm)]"
              style={{ backgroundColor: theme.colors.surfaceMuted }}
            />
            <div
              className="h-3 w-1/2 animate-pulse rounded-[var(--radius-sm)]"
              style={{ backgroundColor: theme.colors.surfaceMuted }}
            />
            <div
              className="mt-4 h-10 animate-pulse rounded-[var(--radius-sm)]"
              style={{ backgroundColor: theme.colors.coralSoft }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div
      role="status"
      aria-label="Se încarcă rezervările"
      aria-busy="true"
      className="overflow-hidden rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_12%,transparent)]"
    >
      <span className="sr-only">Se încarcă rezervările</span>
      <div
        className="h-11 animate-pulse"
        style={{ backgroundColor: theme.colors.surfaceMuted }}
      />
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="h-14 animate-pulse border-t border-[color-mix(in_srgb,var(--color-ivory)_8%,transparent)]"
          style={{
            backgroundColor:
              index % 2 === 0
                ? "color-mix(in srgb, var(--color-ivory) 8%, transparent)"
                : theme.colors.surfaceMuted,
          }}
        />
      ))}
    </div>
  );
}
