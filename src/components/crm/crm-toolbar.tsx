import type { ReactNode } from "react";

export function CrmToolbar({
  resultCount,
  searchName = "q",
  searchDefault = "",
  searchLabel = "Caută",
  children,
  action,
}: {
  resultCount: number;
  searchName?: string;
  searchDefault?: string;
  searchLabel?: string;
  children?: ReactNode;
  action?: string;
}) {
  return (
    <form method="get" action={action} className="mb-5 flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm">
          <span className="opacity-70">{searchLabel}</span>
          <input
            type="search"
            name={searchName}
            defaultValue={searchDefault}
            className="w-full rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-ivory)_16%,transparent)] bg-transparent px-3 py-2"
          />
        </label>
        {children}
        <button
          type="submit"
          className="shrink-0 rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-ivory)_22%,transparent)] bg-transparent px-3 py-2 text-sm font-semibold text-[var(--color-ivory)] transition-[transform,background-color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[color-mix(in_srgb,var(--color-ivory)_6%,transparent)]"
        >
          Filtrează
        </button>
      </div>
      <p className="text-sm opacity-70" aria-live="polite">
        {resultCount} rezultate
      </p>
    </form>
  );
}
