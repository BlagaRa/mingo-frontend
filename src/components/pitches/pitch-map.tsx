type PitchMapProps = {
  lat: number;
  lng: number;
  name: string;
};

export function PitchMap({ lat, lng, name }: PitchMapProps) {
  const delta = 0.01;
  const bbox = [
    lng - delta,
    lat - delta,
    lng + delta,
    lat + delta,
  ].join("%2C");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <section className="overflow-hidden rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_14%,transparent)]">
      <div className="border-b border-[color-mix(in_srgb,var(--color-ivory)_10%,transparent)] bg-[var(--color-surface-muted)] px-4 py-3">
        <h2 className="font-display text-[var(--type-h3)] font-semibold text-[var(--color-ivory)]">
          Hartă
        </h2>
        <p className="text-[var(--type-small)] opacity-80">{name}</p>
      </div>
      <iframe
        title={`Hartă ${name}`}
        src={src}
        className="h-64 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}
