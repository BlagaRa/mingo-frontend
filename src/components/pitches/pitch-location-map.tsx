type PitchLocationMapProps = {
  lat: number;
  lng: number;
  address: string;
};

export function osmEmbedUrl(lat: number, lng: number): string {
  const pad = 0.012;
  const left = lng - pad;
  const right = lng + pad;
  const top = lat + pad;
  const bottom = lat - pad;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function PitchLocationMap({ lat, lng, address }: PitchLocationMapProps) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--color-ivory)_12%,transparent)]">
      <iframe
        title="Hartă locație"
        role="img"
        aria-label={`Hartă locație · ${address}`}
        src={osmEmbedUrl(lat, lng)}
        className="aspect-[16/10] w-full border-0 bg-[var(--color-surface-muted)]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <p className="border-t border-[color-mix(in_srgb,var(--color-ivory)_10%,transparent)] px-3 py-2 text-sm text-[var(--color-ivory)]">
        {address}
      </p>
    </div>
  );
}
