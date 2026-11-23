import Link from "next/link";
import type { ReactNode } from "react";
import { theme } from "@/config/theme";
import { crmEnterClass } from "./crm-motion";

export function KpiCard({
  label,
  value,
  hint,
  href,
  index = 0,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  index?: number;
}) {
  const body: ReactNode = (
    <>
      <p className="text-[var(--type-small)] opacity-70">{label}</p>
      <p
        className="mt-1 font-display text-[length:var(--type-h2)] font-semibold tabular-nums"
        style={{ color: theme.colors.coral }}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-[var(--type-small)] opacity-60">{hint}</p>
      ) : null}
    </>
  );

  const className = `${crmEnterClass} block rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] p-5 transition-[transform,box-shadow] duration-[var(--motion-hover-ms)] ease-[var(--ease-out)] active:scale-[0.99] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-px`;
  const style = { animationDelay: `${index * 40}ms` };

  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {body}
      </Link>
    );
  }

  return (
    <div className={className} style={style}>
      {body}
    </div>
  );
}
