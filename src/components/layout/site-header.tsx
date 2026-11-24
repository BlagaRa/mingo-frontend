"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { appConfig } from "@/config/app";
import { useDemoSession, type DemoRole } from "@/lib/demo-session";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";

const roleLinks: Record<DemoRole, { href: string; label: string }[]> = {
  player: [
    { href: "/terenuri", label: "Terenuri" },
    { href: "/rezervari", label: "Rezervări" },
    { href: "/cont", label: "Cont" },
    { href: "/preturi", label: "Colaborare" },
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

function linkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`nav-link text-[var(--type-small)] font-medium text-[var(--color-ivory)] ${
        active ? "nav-link-active" : ""
      }`}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const { role, setRole } = useDemoSession();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="border-b border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] bg-[var(--color-forest)]">
      <div className="mx-auto flex w-full max-w-[var(--content-max)] flex-wrap items-center justify-between gap-4 px-[var(--page-gutter)] py-4">
        <div className="flex min-w-0 flex-1 items-center gap-10 lg:gap-14">
          <Link
            href="/"
            className="shrink-0 font-display text-[1.5rem] font-semibold tracking-tight text-[var(--color-ivory)]"
          >
            {appConfig.name}
          </Link>
          <nav
            aria-label="Principal"
            className="hidden items-center gap-8 lg:gap-10 sm:flex"
          >
            {roleLinks[role].map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={linkActive(pathname, item.href)}
              />
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
        className="flex gap-6 overflow-x-auto border-t border-[color-mix(in_srgb,var(--color-ivory)_10%,transparent)] px-[var(--page-gutter)] py-3 sm:hidden"
      >
        {roleLinks[role].map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            active={linkActive(pathname, item.href)}
          />
        ))}
      </nav>
    </header>
  );
}
