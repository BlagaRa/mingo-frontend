"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type ReactNode } from "react";
import { appConfig } from "@/config/app";
import { theme } from "@/config/theme";
import { useDemoSession } from "@/lib/demo-session";

const ownerLinks = [
  { href: "/proprietar", label: "Panou" },
  { href: "/proprietar/terenuri", label: "Terenuri" },
  { href: "/proprietar/rezervari", label: "Rezervări" },
  { href: "/proprietar/disponibilitate", label: "Disponibilitate" },
  { href: "/proprietar/statistici", label: "Statistici" },
  { href: "/proprietar/abonamente", label: "Abonament" },
];

const adminLinks = [
  { href: "/admin", label: "Panou" },
  { href: "/admin/membri", label: "Membri" },
  { href: "/admin/terenuri", label: "Terenuri" },
  { href: "/admin/rezervari", label: "Rezervări" },
];

export function DashboardShell({
  mode,
  children,
}: {
  mode: "owner" | "admin";
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { setRole } = useDemoSession();
  const links = mode === "admin" ? adminLinks : ownerLinks;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="flex min-h-full flex-1">
      {menuOpen ? (
        <button
          type="button"
          aria-label="Închide meniul"
          className="fixed inset-0 z-30 bg-[color-mix(in_srgb,var(--color-ivory)_45%,transparent)] md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <aside
        id={menuId}
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[min(15.5rem,86vw)] shrink-0 flex-col border-r px-3 py-5 transition-transform duration-[var(--motion-hover-ms)] ease-[var(--ease-out)] md:sticky md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          backgroundColor: theme.colors.forest,
          color: theme.colors.ivory,
          borderColor: "color-mix(in srgb, #F7F5ED 12%, transparent)",
        }}
      >
        <Link href="/" className="px-2 text-xl font-semibold tracking-tight">
          {appConfig.name}
        </Link>
        <p className="mt-1 px-2 text-[0.75rem] opacity-70">
          {mode === "admin" ? "Administrare" : "Proprietar"}
        </p>
        <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Dashboard">
          {links.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/proprietar" &&
                item.href !== "/admin" &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-[background-color,transform] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.98]"
                style={{
                  backgroundColor: active
                    ? theme.colors.forestFill
                    : "transparent",
                  color: theme.colors.ivory,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-2 border-t border-[color-mix(in_srgb,#F7F5ED_14%,transparent)] pt-4">
          <Link
            href="/"
            onClick={() => setRole("player")}
            className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-opacity hover:opacity-80"
            style={{ color: theme.colors.coral }}
          >
            ← Site public
          </Link>
          <Link
            href="/cont"
            className="block rounded-[var(--radius-sm)] px-3 py-2 text-sm opacity-80 hover:opacity-100"
          >
            Cont
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col bg-[var(--color-forest)]">
        <header className="flex items-center justify-between gap-3 border-b border-[color-mix(in_srgb,var(--color-ivory)_12%,transparent)] px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-ivory)_16%,transparent)] text-[var(--color-ivory)] md:hidden"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Închide meniul" : "Deschide meniul"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden="true" className="text-lg leading-none">
                {menuOpen ? "×" : "☰"}
              </span>
            </button>
            <p className="truncate text-sm font-medium text-[var(--color-ivory)]">
              {mode === "admin" ? "Consolă admin" : "Spațiu proprietar"}
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 text-sm font-medium text-[var(--color-coral)] underline-offset-2 hover:underline"
          >
            Revino pe Mingo
          </Link>
        </header>
        <main id="continut" className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
