"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { confirmBooking } from "@/lib/mock/booking-store";

function ConfirmForm() {
  const router = useRouter();
  const params = useSearchParams();
  const bookingId = params.get("bookingId") ?? "";
  const email = params.get("email") ?? "tu@example.com";
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const code = String(data.get("code") ?? "").trim();
    if (code.length !== 6) {
      setError("Codul are 6 caractere. În demo acceptăm orice cod de 6.");
      return;
    }
    confirmBooking(bookingId);
    router.push(`/rezervari/${bookingId}`);
  }

  return (
    <PageShell
      title="Confirmă rezervarea"
      description={`Ți-am trimis un cod pe ${email}. Introdu-l mai jos ca să validezi rezervarea.`}
    >
      <form
        onSubmit={onSubmit}
        className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] p-5"
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
          Confirmă rezervarea
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setFeedback("Am retrimis codul (demo).")}
        >
          Retrimite codul
        </Button>
        <p role="status" className="text-[var(--type-small)] opacity-80">
          {feedback || "Demo: orice cod de 6 caractere trece."}
        </p>
      </form>
    </PageShell>
  );
}

export default function ConfirmareRezervarePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-md px-[var(--page-gutter)] py-14">
          <Skeleton label="Se încarcă confirmarea rezervării" lines={4} />
        </div>
      }
    >
      <ConfirmForm />
    </Suspense>
  );
}
