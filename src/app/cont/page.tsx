"use client";

import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { useDemoSession } from "@/lib/demo-session";
import { theme } from "@/config/theme";

export default function ContPage() {
  const { role, emailVerified, setRole } = useDemoSession();

  return (
    <PageShell
      title="Contul meu"
      description="Profil demo — confirmarea rămâne pe email."
      actions={
        <Button asChild variant="accent">
          <Link href="/rezervari/nou">Rezervare nouă</Link>
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section
          className="rounded-[var(--radius-md)] border p-6"
          style={{
            borderColor: "color-mix(in srgb, #F7F5ED 14%, transparent)",
            backgroundColor: theme.colors.surfaceMuted,
          }}
        >
          <p className="text-sm opacity-70">Rol activ</p>
          <p className="mt-1 font-display text-3xl font-semibold capitalize text-[var(--color-ivory)]">
            {role === "player"
              ? "Jucător"
              : role === "owner"
                ? "Proprietar"
                : "Admin"}
          </p>
          <p className="mt-4 text-sm">
            Email confirmat:{" "}
            <strong>{emailVerified ? "Da" : "Nu încă"}</strong>
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {!emailVerified ? (
              <Button asChild variant="primary">
                <Link href="/confirmare-email">Confirmă emailul</Link>
              </Button>
            ) : null}
            <Button asChild variant="ghost">
              <Link href="/rezervari">Rezervările mele</Link>
            </Button>
          </div>
        </section>

        <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] p-6">
          <h2 className="font-display text-xl font-semibold text-[var(--color-ivory)]">
            Spații rapide
          </h2>
          <p className="mt-2 text-sm opacity-80">
            În demo poți sări între roluri ca să vezi fiecare shell.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Button asChild variant="accent">
              <Link href="/proprietar" onClick={() => setRole("owner")}>
                Deschide spațiul proprietar
              </Link>
            </Button>
            <Button asChild variant="primary">
              <Link href="/admin" onClick={() => setRole("admin")}>
                Deschide consolă admin
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/terenuri">Catalog public</Link>
            </Button>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
