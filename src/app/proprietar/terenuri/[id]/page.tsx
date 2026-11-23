"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { PitchLocationMap } from "@/components/pitches/pitch-location-map";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { TimeField } from "@/components/ui/time-field";
import { formatRon, getPitch } from "@/lib/mock/queries";
import {
  getPitchProgram,
  setPitchProgram,
} from "@/lib/mock/program-store";
import {
  isPitchVisible,
  setPitchVisible,
} from "@/lib/mock/pitch-visibility-store";

export default function EditPitchPage() {
  const params = useParams<{ id: string }>();
  const pitch = getPitch(params.id);
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [version, setVersion] = useState(0);
  const [address, setAddress] = useState(
    pitch ? `${pitch.oras}, ${pitch.zona}` : "",
  );

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

  void version;
  const visible = isPitchVisible(pitch.id);
  const program = getPitchProgram(pitch.id);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <PageShell
      title={pitch.name}
      description={`${pitch.oras} · ${pitch.zona}`}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={visible ? "accent" : "ghost"}
            onClick={() => {
              setPitchVisible(pitch.id, !visible);
              setVersion((v) => v + 1);
            }}
          >
            {visible ? "Vizibil" : "Ascuns"}
          </Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            Șterge
          </Button>
        </div>
      }
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="grid gap-4 rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] p-5"
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
            label="Adresă"
            name="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            required
          />
          <PitchLocationMap
            lat={pitch.lat}
            lng={pitch.lng}
            address={address || `${pitch.oras}, ${pitch.zona}`}
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
        <section className="rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)] p-5">
          <h2 className="text-[var(--type-h3)] font-semibold">Program</h2>
          <p className="mt-3 text-[var(--type-small)] opacity-90">
            Deschis implicit în intervalul de mai jos. Închizi zile sau ore doar
            când vrei.
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <TimeField
              label="De la"
              value={program.startHour}
              onCommit={(startHour) => {
                const end =
                  startHour <= program.endHour ? program.endHour : startHour;
                setPitchProgram(pitch.id, startHour, end);
                setVersion((v) => v + 1);
              }}
            />
            <TimeField
              label="Până la"
              value={program.endHour}
              onCommit={(endHour) => {
                const start =
                  endHour >= program.startHour ? program.startHour : endHour;
                setPitchProgram(pitch.id, start, endHour);
                setVersion((v) => v + 1);
              }}
            />
          </div>
          <Button asChild variant="accent" className="mt-4">
            <Link href={`/proprietar/disponibilitate?pitch=${pitch.id}`}>
              Editează programul
            </Link>
          </Button>
          <Button asChild variant="ghost" className="mt-2">
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
