"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import {
  formatRon,
  getPitch,
  slotsForPitch,
  formatDateTime,
} from "@/lib/mock/queries";

export default function EditPitchPage() {
  const params = useParams<{ id: string }>();
  const pitch = getPitch(params.id);
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!pitch) {
    return (
      <PageShell title="Terenurile mele">
        <ErrorState
          title="Terenul nu e aici"
          description="Poate a fost șters sau linkul e greșit. Revino la lista ta."
          action={
            <Button asChild variant="accent">
              <Link href="/proprietar/terenuri">Înapoi la terenuri</Link>
            </Button>
          }
        />
      </PageShell>
    );
  }

  const slots = slotsForPitch(pitch.id);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <PageShell
      title={pitch.name}
      description={`${pitch.oras} · ${pitch.zona}`}
      actions={
        <Button variant="danger" onClick={() => setDeleteOpen(true)}>
          Șterge
        </Button>
      }
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="grid gap-4 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_14%,transparent)] p-5"
        >
          <Input label="Nume" name="name" defaultValue={pitch.name} required />
          <Input label="Zonă" name="zona" defaultValue={pitch.zona} required />
          <Input
            label="Preț pe oră (tot terenul)"
            name="pricePerHour"
            type="number"
            defaultValue={pitch.pricePerHourRon}
          />
          <Input
            label="Locație (lat)"
            name="lat"
            defaultValue={String(pitch.lat)}
          />
          <Input
            label="Locație (lng)"
            name="lng"
            defaultValue={String(pitch.lng)}
          />
          <div
            className="aspect-[16/10] rounded-[var(--radius-md)] bg-[var(--color-surface-muted)]"
            role="img"
            aria-label="Galerie foto teren"
          />
          <Button type="submit" variant="accent">
            Salvează modificările
          </Button>
          {saved ? (
            <p className="text-[var(--type-small)]" role="status">
              Salvat în demo. Preț curent:{" "}
              {formatRon(pitch.pricePerHourRon)} / oră.
            </p>
          ) : null}
        </form>
        <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-forest)_14%,transparent)] p-5">
          <h2 className="text-[var(--type-h3)] font-semibold">Intervale</h2>
          <ul className="mt-3 space-y-2 text-[var(--type-small)]">
            {slots.map((slot) => (
              <li key={slot.id}>{formatDateTime(slot.startsAt)}</li>
            ))}
          </ul>
          <Button asChild variant="ghost" className="mt-4">
            <Link href={`/terenuri/${pitch.id}`}>Previzualizare publică</Link>
          </Button>
        </section>
      </div>
      <Dialog
        open={deleteOpen}
        title="Ștergi terenul?"
        description="Doar UI demo — confirmarea nu șterge date reale."
        confirmLabel="Șterge terenul"
        tone="danger"
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => setDeleteOpen(false)}
      />
    </PageShell>
  );
}
