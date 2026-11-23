import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageShell({
  title,
  description,
  actions,
  children,
}: PageShellProps) {
  return (
    <div className="mx-auto w-full max-w-[var(--content-max)] px-[var(--page-gutter)] py-7 sm:py-14">
      <div className="mb-7 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-5">
        <div className="max-w-[40rem]">
          <h1 className="font-display text-[length:var(--type-h1)] font-semibold tracking-tight text-pretty text-[var(--color-ivory)]">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-[48ch] text-[var(--type-body)] text-[var(--color-ivory)]/85 sm:mt-3">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap gap-2">{actions}</div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
