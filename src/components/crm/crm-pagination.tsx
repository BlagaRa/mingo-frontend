import Link from "next/link";
import { theme } from "@/config/theme";

function buildHref(
  basePath: string,
  page: number,
  filters: Record<string, string | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (!value || key === "page") continue;
    search.set(key, value);
  }
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}

const ivoryEdge = "inset 0 0 0 1px color-mix(in srgb, #F7F5ED 16%, transparent)";

export function CrmPagination({
  basePath,
  page,
  totalPages,
  filters,
  ariaLabel = "Paginare",
}: {
  basePath: string;
  page: number;
  totalPages: number;
  filters: Record<string, string | undefined>;
  ariaLabel?: string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label={ariaLabel}
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      <Link
        href={buildHref(basePath, Math.max(1, page - 1), filters)}
        scroll={false}
        data-scroll-preserve="true"
        aria-disabled={page <= 1}
        className="rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold transition-[transform,opacity] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97] aria-disabled:pointer-events-none aria-disabled:opacity-35"
        style={{
          color: theme.colors.ivory,
          boxShadow: ivoryEdge,
        }}
      >
        Înapoi
      </Link>
      {pages.map((value) => {
        const active = value === page;
        return (
          <Link
            key={value}
            href={buildHref(basePath, value, filters)}
            scroll={false}
            data-scroll-preserve="true"
            aria-current={active ? "page" : undefined}
            className="min-w-10 rounded-[var(--radius-sm)] px-3 py-2 text-center text-sm font-semibold tabular-nums transition-[transform,background-color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
            style={{
              backgroundColor: active ? theme.colors.coral : "transparent",
              color: active ? theme.colors.onCoral : theme.colors.ivory,
              boxShadow: active ? "none" : ivoryEdge,
            }}
          >
            {value}
          </Link>
        );
      })}
      <Link
        href={buildHref(basePath, Math.min(totalPages, page + 1), filters)}
        scroll={false}
        data-scroll-preserve="true"
        aria-disabled={page >= totalPages}
        className="rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold transition-[transform,opacity] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97] aria-disabled:pointer-events-none aria-disabled:opacity-35"
        style={{
          color: theme.colors.ivory,
          boxShadow: ivoryEdge,
        }}
      >
        Înainte
      </Link>
    </nav>
  );
}
