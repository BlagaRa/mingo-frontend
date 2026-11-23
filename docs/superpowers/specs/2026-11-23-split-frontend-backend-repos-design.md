# Split Mingo into frontend + backend GitHub repos — design

## Intent

Publish Mingo under [BlagaRa](https://github.com/BlagaRa) as two repos: `mingo-frontend` (current Next demo) and `mingo-backend` (empty for now).

## Why

Separate deploy/ownership surfaces before a real API exists; empty backend reserves the name and layout.

## Goals

- Local folders: `frontend/` (moved Next app), `backend/` (empty scaffold).
- GitHub public repos: `BlagaRa/mingo-frontend`, `BlagaRa/mingo-backend`.
- No secrets (`.env.local`) in git.

## Non-goals

- Implementing API routes or replacing mocks.
- Monorepo, CI, Docker.
- Changing demo behavior.

## Approaches

1. **Two repos + two local folders** (chosen) — matches “repo-urile” + folder split.
2. Single monorepo with `frontend/` + `backend/` — rejected; user wants two repos.
3. Frontend-only repo, backend later — rejected; create empty backend now.

## Design

- Move app files into `frontend/` (exclude `node_modules`, `.next`, `.env.local`, `.superpowers`).
- `backend/`: README + `.gitignore` only.
- `gh repo create` public, initial commit, push via existing BlagaRa auth.
