"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { useDemoSession } from "@/lib/demo-session";

function ConfirmForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? "tu@example.com";
  const { setEmailVerified, role } = useDemoSession();
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const code = String(data.get("code") ?? "").trim();
    if (code.length !== 6) {
      setError("Codul are 6 caractere. În demo acceptăm orice cod de 6.");
      return;
    }
    setEmailVerified(true);
    if (role === "owner") router.push("/proprietar");
    else if (role === "admin") router.push("/admin");
    else router.push("/cont");
  }

  return (
    <PageShell
      title="Confirmă emailul"
      description={`Am trimis un cod către ${email}. Introdu-l mai jos — fără telefon.`}
    >
      <form
        onSubmit={onSubmit}
        className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_14%,transparent)] p-5"
      >
        <Input
          label="Cod din email"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          spellCheck={false}
          maxLength={6}
          required
          error={error}
        />
        <Button type="submit" variant="accent">
          Confirmă
        </Button>
        <p className="text-[var(--type-small)] opacity-80">
          Demo: orice cod de 6 caractere trece.
        </p>
      </form>
    </PageShell>
  );
}

export default function ConfirmareEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-md px-[var(--page-gutter)] py-14">
          <Skeleton label="Se încarcă confirmarea" lines={4} />
        </div>
      }
    >
      <ConfirmForm />
    </Suspense>
  );
}
