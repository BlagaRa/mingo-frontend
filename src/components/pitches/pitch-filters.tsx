"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/ui/select-field";
import { uniqueLocations, pitches } from "@/lib/mock/queries";
import { theme } from "@/config/theme";

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded-[var(--radius-sm)] px-3.5 py-2 text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
      style={{
        backgroundColor: active
          ? theme.colors.coral
          : theme.colors.surfaceMuted,
        color: active ? theme.colors.onCoral : theme.colors.ivory,
        boxShadow: active
          ? "none"
          : "inset 0 0 0 1px color-mix(in srgb, #F7F5ED 14%, transparent)",
      }}
    >
      {label}
    </button>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-center">
      <p className="text-sm font-medium text-[var(--color-ivory)]">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function PitchFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const locations = useMemo(() => uniqueLocations(pitches), []);

  const judet = params.get("judet") ?? "";
  const oras = params.get("oras") ?? "";
  const zona = params.get("zona") ?? "";
  const q = params.get("q") ?? "";
  const surface = params.get("surface") ?? "";
  const covered = params.get("covered") === "1";
  const nightLights = params.get("nightLights") === "1";
  const indoor = params.get("indoor") === "1";
  const minCapacity = params.get("minCapacity") ?? "";

  const advancedCount = [
    surface,
    covered,
    nightLights,
    indoor,
    minCapacity,
  ].filter(Boolean).length;
  const [moreOpen, setMoreOpen] = useState(advancedCount > 0);

  function update(next: Record<string, string>, clear: string[] = []) {
    const search = new URLSearchParams(params.toString());
    for (const key of clear) search.delete(key);
    for (const [key, value] of Object.entries(next)) {
      if (!value) search.delete(key);
      else search.set(key, value);
    }
    search.delete("page");
    const query = search.toString();
    router.replace(query ? `/terenuri?${query}` : "/terenuri", {
      scroll: false,
    });
  }

  function toggle(key: string, on: boolean) {
    update({ [key]: on ? "" : "1" });
  }

  const orasOptions = judet ? (locations.oraseByJudet[judet] ?? []) : [];
  const zonaOptions = oras ? (locations.zoneByOras[oras] ?? []) : [];
  const hasFilters = Boolean(
    judet ||
      oras ||
      zona ||
      q ||
      surface ||
      covered ||
      nightLights ||
      indoor ||
      minCapacity,
  );

  return (
    <section
      aria-label="Filtre terenuri"
      className="w-full border-b border-[color-mix(in_srgb,var(--color-ivory)_12%,transparent)] pb-8"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--color-ivory)]">
          Filtre
        </h2>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => router.replace("/terenuri", { scroll: false })}
            className="text-sm font-semibold text-[var(--color-ivory)] underline underline-offset-4 transition-opacity duration-[var(--motion-press-ms)] ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-70"
          >
            Resetează
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SelectField
          label="Județ"
          name="judet"
          value={judet}
          emptyLabel="Toate"
          options={locations.judete.map((value) => ({
            value,
            label: value,
          }))}
          onValueChange={(next) => update({ judet: next }, ["oras", "zona"])}
        />
        <SelectField
          label="Oraș"
          name="oras"
          value={oras}
          disabled={!judet}
          emptyLabel="Toate"
          options={orasOptions.map((value) => ({ value, label: value }))}
          onValueChange={(next) => update({ oras: next }, ["zona"])}
        />
        <SelectField
          label="Zonă"
          name="zona"
          value={zona}
          disabled={!oras}
          emptyLabel="Toate"
          options={zonaOptions.map((value) => ({ value, label: value }))}
          onValueChange={(next) => update({ zona: next })}
        />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            update({ q: String(data.get("q") ?? "") });
          }}
        >
          <Input
            label="Caută"
            name="q"
            defaultValue={q}
            placeholder="Nume teren…"
            autoComplete="off"
          />
        </form>
      </div>

      <div className="mt-5">
        <button
          type="button"
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((current) => !current)}
          className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold text-[var(--color-ivory)] transition-[transform,background-color] duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
          style={{
            backgroundColor: moreOpen
              ? theme.colors.surfaceMuted
              : "transparent",
            boxShadow: moreOpen
              ? "none"
              : "inset 0 0 0 1px color-mix(in srgb, #F7F5ED 14%, transparent)",
          }}
        >
          Mai multe filtre
          {advancedCount > 0 ? (
            <span
              className="rounded-full px-1.5 py-0.5 text-[0.7rem] font-bold tabular-nums"
              style={{
                backgroundColor: theme.colors.coral,
                color: theme.colors.onCoral,
              }}
            >
              {advancedCount}
            </span>
          ) : null}
          <svg
            aria-hidden
            viewBox="0 0 12 8"
            width="10"
            height="7"
            className="transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)]"
            style={{ transform: moreOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <path
              d="M1.5 1.75L6 6.25L10.5 1.75"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

      </div>

      {moreOpen ? (
        <div className="mt-5 space-y-5">
          <FilterRow label="Suprafață">
            {["", "Sintetic", "Iarbă artificială", "Natural"].map((value) => (
              <FilterChip
                key={value || "all"}
                label={value || "Toate"}
                active={surface === value}
                onClick={() => update({ surface: value })}
              />
            ))}
          </FilterRow>

          <FilterRow label="Facilități">
            <FilterChip
              label="Acoperit"
              active={covered}
              onClick={() => toggle("covered", covered)}
            />
            <FilterChip
              label="Nocturnă"
              active={nightLights}
              onClick={() => toggle("nightLights", nightLights)}
            />
            <FilterChip
              label="Indoor"
              active={indoor}
              onClick={() => toggle("indoor", indoor)}
            />
          </FilterRow>

          <FilterRow label="Capacitate">
            {["", "10", "12", "14"].map((value) => (
              <FilterChip
                key={value || "any"}
                label={value ? `${value}+` : "Oricare"}
                active={minCapacity === value}
                onClick={() => update({ minCapacity: value })}
              />
            ))}
          </FilterRow>
        </div>
      ) : null}
    </section>
  );
}
