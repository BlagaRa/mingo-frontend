import { theme } from "@/config/theme";

export type ChartDatum = { label: string; value: number };

export function BarChart({
  data,
  title,
}: {
  data: ChartDatum[];
  title: string;
}) {
  if (data.length === 0) {
    return <p className="text-sm opacity-70">Nu există date</p>;
  }

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      role="img"
      aria-label={title}
      className="space-y-3"
    >
      <p className="text-sm font-semibold text-[var(--color-forest)]">{title}</p>
      <ul className="space-y-3">
        {data.map((row) => (
          <li key={row.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium">{row.label}</span>
              <span className="tabular-nums">{row.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)]">
              <div
                className="h-full rounded-[var(--radius-sm)] transition-[width] duration-500 ease-[var(--ease-out)]"
                style={{
                  width: `${(row.value / max) * 100}%`,
                  background: `linear-gradient(90deg, ${theme.colors.forestFill}, ${theme.colors.coral})`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
