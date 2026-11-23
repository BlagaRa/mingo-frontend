"use client";

import { FormEvent, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <PageShell
      title="Contact"
      description="Scrie-ne — în demo mesajul nu pleacă pe email real."
    >
      <form
        onSubmit={onSubmit}
        className="mx-auto grid w-full max-w-lg gap-4 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] bg-[var(--color-coral-soft)]/40 p-5"
      >
        <Input label="Nume" name="name" required autoComplete="name" />
        <Input
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          spellCheck={false}
        />
        <label className="flex flex-col gap-1.5 text-[var(--type-small)]">
          <span className="font-medium">Mesaj</span>
          <textarea
            name="message"
            required
            rows={4}
            className="rounded-[var(--radius-sm)] border border-[color-mix(in_srgb,var(--color-ivory)_22%,transparent)] bg-[var(--color-surface-muted)] px-3 py-2"
          />
        </label>
        <Button type="submit" variant="accent">
          Trimite
        </Button>
        {sent ? (
          <p role="status" className="text-sm">
            Mulțumim — mesaj înregistrat în demo.
          </p>
        ) : null}
      </form>
    </PageShell>
  );
}
