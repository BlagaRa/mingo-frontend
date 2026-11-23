import Link from "next/link";
import { crmEnterClass } from "./crm-motion";

export function ActivityList({
  items,
}: {
  items: {
    id: string;
    title: string;
    meta: string;
    statusLabel?: string;
    href?: string;
  }[];
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm opacity-70">Nu există activitate recentă</p>
    );
  }

  return (
    <ul
      className={`${crmEnterClass} divide-y divide-[color-mix(in_srgb,var(--color-ivory)_10%,transparent)] rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)]`}
    >
      {items.map((item) => {
        const content = (
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium">{item.title}</p>
              <p className="text-[var(--type-small)] opacity-65">{item.meta}</p>
            </div>
            {item.statusLabel ? (
              <span className="shrink-0 rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--color-ivory)_6%,transparent)] px-2 py-1 text-xs font-semibold text-[var(--color-ivory)]">
                {item.statusLabel}
              </span>
            ) : null}
          </div>
        );
        return (
          <li key={item.id}>
            {item.href ? (
              <Link
                href={item.href}
                className="block px-4 py-3 transition-colors duration-[var(--motion-press-ms)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:bg-[color-mix(in_srgb,var(--color-ivory)_4%,transparent)]"
              >
                {content}
              </Link>
            ) : (
              <div className="px-4 py-3">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
