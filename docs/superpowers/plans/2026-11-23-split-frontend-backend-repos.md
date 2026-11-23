# Split frontend/backend repos — plan

> Native execution (user approved design + create action).

**Goal:** `frontend/` + `backend/` locally; public `mingo-frontend` and `mingo-backend` on BlagaRa.

**Spec:** `docs/superpowers/specs/2026-11-23-split-frontend-backend-repos-design.md`

## Tasks

1. Create `frontend/` and `backend/`; move app into `frontend/` (exclude node_modules, .next, .env.local, .superpowers).
2. Scaffold empty `backend/` (README + .gitignore); `git init` + `gh repo create BlagaRa/mingo-backend --public --push`.
3. `git init` in `frontend/`; ensure .gitignore; initial commit; `gh repo create BlagaRa/mingo-frontend --public --push`.
4. `npm install` in `frontend/`; smoke `npm test` (or report if too heavy).
5. Parent README pointing at both folders/repos.
