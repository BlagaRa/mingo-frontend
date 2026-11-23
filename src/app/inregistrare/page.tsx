"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { getPlan } from "@/config/plans";
import { useDemoSession, type DemoRole } from "@/lib/demo-session";

function InregistrareForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { setRole } = useDemoSession();
  const [error, setError] = useState("");

  const planId = params.get("plan") ?? "";
  const selectedPlan = getPlan(planId);
  const roleParam = params.get("role");
  const defaultRole: DemoRole =
    selectedPlan || roleParam === "owner" ? "owner" : "player";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const role = String(data.get("role") ?? "player") as DemoRole;
    if (!email.includes("@")) {
      setError("Introdu un email valid.");
      return;
    }
    setRole(role === "owner" ? "owner" : "player");
    const confirmParams = new URLSearchParams({
      email,
    });
    if (selectedPlan) {
      confirmParams.set("plan", selectedPlan.id);
    }
    router.push(`/confirmare-email?${confirmParams.toString()}`);
  }

  return (
    <PageShell
      title="Înregistrare"
      description="Alege dacă joci sau administrezi terenuri. Confirmarea vine pe email."
    >
      <form
        onSubmit={onSubmit}
        className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] p-5"
      >
        {selectedPlan ? (
          <p className="rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-coral)_40%,transparent)] bg-[var(--color-coral-soft)] px-3 py-2 text-sm">
            Plan selectat: {selectedPlan.name} · {selectedPlan.price}
          </p>
        ) : null}
        <Input label="Nume" name="name" autoComplete="name" required />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={error}
        />
        <SelectField
          label="Rol"
          name="role"
          defaultValue={defaultRole}
          options={[
            { value: "player", label: "Jucător" },
            { value: "owner", label: "Proprietar de teren" },
          ]}
        />
        <Button type="submit" variant="accent">
          Creează cont
        </Button>
        <p className="text-[var(--type-small)] opacity-80">
          Ai deja cont?{" "}
          <Link
            href="/autentificare"
            className="underline-offset-2 hover:underline"
          >
            Intră
          </Link>
        </p>
      </form>
    </PageShell>
  );
}

export default function InregistrarePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-md px-[var(--page-gutter)] py-14">
          <Skeleton label="Se încarcă înregistrarea" lines={4} />
        </div>
      }
    >
      <InregistrareForm />
    </Suspense>
  );
}
