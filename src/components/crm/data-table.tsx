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
    <div className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] md:overflow-x-auto">
      <table className="mingo-data-table min-w-full text-left text-sm">
        <thead style={{ backgroundColor: theme.colors.surfaceMuted }}>
          <tr>
            {columns.map((column) => (
              <th
                key={column || "actions"}
                className="px-4 py-3 font-semibold"
                data-label={column}
              >
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
