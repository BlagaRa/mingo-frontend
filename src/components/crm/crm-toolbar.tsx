import type { ReactNode } from "react";

export function CrmToolbar({
  resultCount,
  searchName = "q",
  searchDefault = "",
  children,
  action,
}: {
  resultCount: number;
  searchName?: string;
  searchDefault?: string;
  children?: ReactNode;
  action?: string;
}) {
  return (
    <form
      method="get"
      action={action}
      className="mb-4 flex flex-wrap items-end gap-3"
    >
      <label className="flex min-w-[12rem] flex-1 flex-col gap-1 text-sm">
        <span className="opacity-70">Caută</span>
        <input
          type="search"
          name={searchName}
          defaultValue={searchDefault}
          className="rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-forest)_16%,transparent)] bg-transparent px-3 py-2"
        />
      </label>
      {children}
      <button
        type="submit"
        className="rounded-[var(--radius-sm)] bg-[var(--color-forest)] px-4 py-2 text-sm font-semibold text-[var(--color-ivory)] transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
      >
        Filtrează
      </button>
      <p className="ml-auto text-sm opacity-70" aria-live="polite">
        {resultCount} rezultate
      </p>
    </form>
  );
}
