# 05 - GEMINI.md Root Context Template

Copy this file content into `/GEMINI.md` at repo root before execution starts.

```markdown
# GEMINI.md - PropFlow Customer Portal Migration

## Objective

Execute the local migration contract from `customer-portal-execution-kit/11-local-execution-contract.md` to replace `frontend/apps/customer-app` with a Next.js website at `frontend/apps/customer-portal` while preserving valuer-dashboard design language.

## Repository Context

- Monorepo with pnpm workspaces.
- Frontend reference baseline: `frontend/apps/valuer-dashboard`.
- Source mobile app to replace: `frontend/apps/customer-app` (removed).
- Shared packages: `@propflow/theme`, `@propflow/types`, `@propflow/ui`, `@propflow/utils`.

## Execution Mode

- Model: Gemini 3 Flash
- Model id (if selectable): `gemini-3-flash-preview`
- One phase per session.
- Use tracker kit in `customer-portal-execution-kit`.
- Keep edits small and focused.
- Thinking level: `high` by default.
- Temperature: keep default `1.0`.

## Mandatory Process

1. Read:
   - `customer-portal-execution-kit/11-local-execution-contract.md`
   - `customer-portal-execution-kit/00-agent-loop.md`
   - `customer-portal-execution-kit/01-master-tracker.md`
   - `customer-portal-execution-kit/02-phase-playbooks.md`
   - `customer-portal-execution-kit/04-quality-gates.md`
2. Optional cross-check: `plan-claude.md` (if present).
3. Execute only active phase.
4. Run required checks.
5. Update tracker evidence and status.
6. Stop after phase completion.

## Tech Stack (Target App)

- Next.js 16 (App Router), React 19, TypeScript
- Zustand, Axios, React Query
- framer-motion, lucide-react
- leaflet/react-leaflet for maps

## Coding Rules

- Match valuer-dashboard visual patterns.
- Use inline style objects and existing project conventions.
- No React Native/Expo imports in target app.
- Avoid `any`; keep TypeScript strict.
- Prefer copy-then-adapt from existing files.
- Keep instructions concise and explicit; avoid verbose prompt engineering.

## Route Contract

- Public: `/login`
- Protected:
  - `/`
  - `/new`
  - `/new/details`
  - `/new/location`
  - `/new/photos`
  - `/new/review`
  - `/property/[id]`
  - `/property/[id]/result`
  - `/property/[id]/follow-up`
  - `/help` (if in MVP)

## Forbidden Actions

- Do not modify backend API contracts.
- Do not redesign valuer-dashboard.
- Do not delete customer-app until decommission phase (already done).
- Do not start next phase early.

## Verification Discipline

- Run phase-required checks from execution kit.
- If a command fails 3 times, stop and log blocker.

## Completion Standard

A phase is complete only if:

- required commands pass
- tracker updated
- phase status marked DONE
```
