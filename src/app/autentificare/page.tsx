"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AutentificarePage() {
  const router = useRouter();
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    if (!email.includes("@")) {
      setError("Introdu un email valid.");
      return;
    }
    router.push(`/confirmare-email?email=${encodeURIComponent(email)}`);
  }

  return (
    <PageShell
      title="Autentificare"
      description="Introdu emailul. Îți trimitem un cod de confirmare (simulat în demo)."
    >
      <form
        onSubmit={onSubmit}
        className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] p-5"
      >
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          required
          error={error}
        />
        <Button type="submit" variant="accent">
          Continuă
        </Button>
        <p className="text-[var(--type-small)] opacity-80">
          Nu ai cont?{" "}
          <Link href="/inregistrare" className="underline-offset-2 hover:underline">
            Înregistrează-te
          </Link>
        </p>
      </form>
    </PageShell>
  );
}
