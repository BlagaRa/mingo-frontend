"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";

export default function TerenNouPage() {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/proprietar/terenuri/p-1");
  }

  return (
    <PageShell
      title="Teren nou"
      description="Adaugă nume, zonă, prețuri și locație. Pozele reale le aduci tu mai târziu."
    >
      <form
        onSubmit={onSubmit}
        className="mx-auto grid w-full max-w-xl gap-4 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] p-5"
      >
        <Input label="Nume teren" name="name" required />
        <Input label="Județ" name="judet" required defaultValue="Cluj" />
        <Input label="Oraș" name="oras" required defaultValue="Cluj-Napoca" />
        <Input label="Zonă" name="zona" required />
        <Input
          label="Preț pe oră — tot terenul (RON)"
          name="pricePerHour"
          type="number"
          min={1}
          required
        />
        <Input
          label="Capacitate"
          name="capacity"
          type="number"
          min={6}
          max={22}
          defaultValue={10}
          required
        />
        <SelectField
          label="Suprafață"
          name="surface"
          options={[
            { value: "Sintetic", label: "Sintetic" },
            { value: "Iarbă artificială", label: "Iarbă artificială" },
            { value: "Natural", label: "Natural" },
          ]}
        />
        <Input
          label="Poze (placeholder)"
          name="photos"
          placeholder="Încarcă mai târziu — acum e doar UI"
        />
        <Button type="submit" variant="accent">
          Salvează terenul
        </Button>
      </form>
    </PageShell>
  );
}
