import type { ReactNode } from "react";
import { theme } from "@/config/theme";
import { crmEnterClass } from "./crm-motion";

export function DataTable({
  columns,
  children,
  empty,
}: {
  columns: string[];
  children: ReactNode;
  empty?: ReactNode;
}) {
  const hasRows = Boolean(children);

  if (!hasRows && empty) {
    return <>{empty}</>;
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_14%,transparent)]">
      <table className="min-w-full text-left text-sm">
        <thead style={{ backgroundColor: theme.colors.surfaceMuted }}>
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={crmEnterClass}>{children}</tbody>
      </table>
    </div>
  );
}
