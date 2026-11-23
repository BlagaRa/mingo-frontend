/** Brand ink — deep forest for text */
const forest = "#073035";
/** Visible forest for fills so buttons do not read as black */
const forestFill = "#1B6B5A";
const ivory = "#F7F5ED";
const coral = "#FF8E79";

function readMinViewport(): number {
  const raw = process.env.NEXT_PUBLIC_MIN_VIEWPORT_PX;
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed >= 360 ? parsed : 360;
}

export const theme = {
  colors: {
    ivory,
    forest,
    forestFill,
    coral,
    ink: forest,
    onForest: ivory,
    onCoral: forest,
    /** Warm ivory mute — never mint; stays in forest/ivory/coral family */
    surfaceMuted: "#EDE9DF",
    coralSoft: "#FFE4D8",
    /** Soft amber for open / pending bookings */
    statusOpen: "#F1E6A8",
    /** Coral-red wash for cancelled bookings */
    statusDanger: "#FFB4A3",

  },

  radii: {
    sm: "4px",
    md: "6px",
  },
  type: {
    body: "1.0625rem",
    small: "0.875rem",
    h1: "clamp(2.25rem, 5vw, 3.4rem)",
    h2: "clamp(1.6rem, 3.2vw, 2.15rem)",
    h3: "1.25rem",
  },
  motion: {
    pressMs: 160,
    hoverMs: 200,
    easeOut: "cubic-bezier(0.23, 1, 0.32, 1)",
  },
  minViewportPx: readMinViewport(),
} as const;

export type Theme = typeof theme;
