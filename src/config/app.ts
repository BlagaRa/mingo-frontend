export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Mingo",
  minViewportPx: Number.parseInt(
    process.env.NEXT_PUBLIC_MIN_VIEWPORT_PX ?? "360",
    10,
  ),
  demoRole: (process.env.NEXT_PUBLIC_DEMO_ROLE ?? "player") as
    | "player"
    | "owner"
    | "admin",
} as const;
