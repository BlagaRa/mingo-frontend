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
    <div className="mx-auto w-full max-w-[var(--content-max)] px-[var(--page-gutter)] py-10 sm:py-14">
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[40rem]">
          <h1 className="font-display text-[length:var(--type-h1)] font-semibold tracking-tight text-pretty text-[var(--color-forest)]">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-[48ch] text-[var(--type-body)] text-[var(--color-forest-fill)]">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
