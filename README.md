# mingo-frontend

Frontend demo for football pitch booking (owners, players, admin). Next.js 16.4.5, TypeScript, mock data only.

Companion API repo (empty for now): [mingo-backend](https://github.com/BlagaRa/mingo-backend).

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm test` — Vitest suite
- `npm run lint` — ESLint

## Theme

Colors, radii, type, and motion live in `src/config/theme.ts` and are applied as CSS variables on `<html>`. App name and min viewport come from `.env.local` (`NEXT_PUBLIC_*`).

## Demo roles

Use the header role switcher to reach player, owner, and admin shells without a backend.
