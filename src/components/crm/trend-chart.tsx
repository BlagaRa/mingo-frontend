import { theme } from "@/config/theme";
import type { ChartDatum } from "./bar-chart";

export function TrendChart({
  data,
  title,
}: {
  data: ChartDatum[];
  title: string;
}) {
  if (data.length === 0) {
    return <p className="text-sm opacity-70">Nu există date</p>;
  }

  const width = 320;
  const height = 120;
  const pad = 12;
  const max = Math.max(...data.map((d) => d.value), 1);
  const step =
    data.length === 1 ? 0 : (width - pad * 2) / (data.length - 1);
  const points = data
    .map((row, index) => {
      const x = pad + index * step;
      const y = height - pad - (row.value / max) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div role="img" aria-label={title}>
      <p className="mb-3 text-sm font-semibold text-[var(--color-forest)]">
        {title}
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-32 w-full"
        aria-hidden="true"
      >
        <polyline
          fill="none"
          stroke={theme.colors.forestFill}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
        {data.map((row, index) => {
          const x = pad + index * step;
          const y = height - pad - (row.value / max) * (height - pad * 2);
          return (
            <circle
              key={row.label}
              cx={x}
              cy={y}
              r={3.5}
              fill={theme.colors.coral}
            />
          );
        })}
      </svg>
    </div>
  );
}
