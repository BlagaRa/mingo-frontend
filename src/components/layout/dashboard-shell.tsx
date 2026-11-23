"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { appConfig } from "@/config/app";
import { theme } from "@/config/theme";
import { useDemoSession } from "@/lib/demo-session";

const ownerLinks = [
  { href: "/proprietar", label: "Panou" },
  { href: "/proprietar/terenuri", label: "Terenuri" },
  { href: "/proprietar/rezervari", label: "Rezervări" },
  { href: "/proprietar/disponibilitate", label: "Disponibilitate" },
  { href: "/proprietar/calendar", label: "Calendar" },
  { href: "/proprietar/statistici", label: "Statistici" },
  { href: "/proprietar/abonamente", label: "Abonamente" },
  { href: "/proprietar/terenuri/nou", label: "Teren nou" },
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

  return (
    <div className="flex min-h-full flex-1">
      <aside
        className="sticky top-0 flex h-screen w-[15.5rem] shrink-0 flex-col border-r px-3 py-5"
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
      <div className="flex min-w-0 flex-1 flex-col bg-[var(--color-ivory)]">
        <header className="flex items-center justify-between border-b border-[color-mix(in_srgb,var(--color-forest)_12%,transparent)] px-6 py-4">
          <p className="text-sm font-medium text-[var(--color-forest)]">
            {mode === "admin" ? "Consolă admin" : "Spațiu proprietar"}
          </p>
          <Link
            href="/"
            className="text-sm font-medium text-[var(--color-forest-fill)] underline-offset-2 hover:underline"
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
