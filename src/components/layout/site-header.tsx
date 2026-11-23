"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { appConfig } from "@/config/app";
import { useDemoSession, type DemoRole } from "@/lib/demo-session";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";

const roleLinks: Record<DemoRole, { href: string; label: string }[]> = {
  player: [
    { href: "/terenuri", label: "Terenuri" },
    { href: "/rezervari", label: "Rezervări" },
    { href: "/cont", label: "Cont" },
  ],
  owner: [
    { href: "/proprietar", label: "Panou" },
    { href: "/proprietar/terenuri", label: "Terenuri" },
    { href: "/proprietar/rezervari", label: "Rezervări" },
  ],
  admin: [
    { href: "/admin", label: "Panou" },
    { href: "/admin/membri", label: "Membri" },
    { href: "/admin/rezervari", label: "Rezervări" },
  ],
};

const roles: DemoRole[] = ["player", "owner", "admin"];

export function SiteHeader() {
  const { role, setRole } = useDemoSession();
  const router = useRouter();

  return (
    <header className="border-b border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] bg-[var(--color-forest)]">
      <div className="mx-auto flex w-full max-w-[var(--content-max)] flex-wrap items-center justify-between gap-4 px-[var(--page-gutter)] py-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-display text-[1.5rem] font-semibold tracking-tight text-[var(--color-ivory)]"
          >
            {appConfig.name}
          </Link>
          <nav aria-label="Principal" className="hidden items-center gap-4 sm:flex">
            {roleLinks[role].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[var(--type-small)] transition-opacity duration-[var(--motion-press-ms)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-70"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Combobox
            label="Rol demo"
            className="min-w-[9.5rem] [&>span]:sr-only"
            value={role}
            options={roles.map((item) => ({
              value: item,
              label:
                item === "player"
                  ? "Jucător"
                  : item === "owner"
                    ? "Proprietar"
                    : "Admin",
            }))}
            onValueChange={(next) => {
              const roleNext = next as DemoRole;
              setRole(roleNext);
              if (roleNext === "owner") router.push("/proprietar");
              else if (roleNext === "admin") router.push("/admin");
              else router.push("/");
            }}
          />
          <Button asChild variant="soft">
            <Link href="/autentificare">Login</Link>
          </Button>
          <Button asChild variant="accent">
            <Link href="/inregistrare">Înregistrează-te</Link>
          </Button>
        </div>
      </div>
      <nav
        aria-label="Mobil"
        className="flex gap-4 overflow-x-auto border-t border-[color-mix(in_srgb,var(--color-ivory)_10%,transparent)] px-[var(--page-gutter)] py-3 sm:hidden"
      >
        {roleLinks[role].map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap text-[var(--type-small)]">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
