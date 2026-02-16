# 11 - Local Execution Contract (Self-Contained)

This is the local execution contract for the migration. It is designed to remove reliance on external planning docs.

---

## Mission

Replace legacy `customer-app` (removed) with a web-first `frontend/apps/customer-portal` built in Next.js, matching valuer-dashboard style and architecture.

---

## Non-Negotiables

- One phase per session.
- Copy-then-adapt from valuer-dashboard where specified.
- No React Native/Expo imports in target app.
- Required quality gates must pass before phase closure.
- Decommission mobile only after web implementation is validated.

---

## In Scope

- Build customer web app routes and flows.
- Reuse shared packages (`@propflow/theme`, `@propflow/types`, `@propflow/ui`, `@propflow/utils`).
- Remove mobile app and mobile CI/CD references.
- Update docs/scripts to web-only customer portal.

## Out of Scope

- Backend API redesign.
- New product features outside existing customer journey.

---

## Route Contract

Public:

- `/login`

Protected:

- `/`
- `/new`
- `/new/details`
- `/new/location`
- `/new/photos`
- `/new/review`
- `/property/[id]`
- `/property/[id]/result`
- `/property/[id]/follow-up`
- `/help` (if in approved MVP)

---

## Phase Contract

1. Scaffolding (`customer-portal` app baseline).
2. Core layout parity.
3. Authentication.
4. Multi-step valuation wizard.
5. Property status/results/follow-up journey.
6. API and services layer.
7. Component/form/provider completeness.
8. Mobile decommission.
9. Responsive/a11y/SEO polish.
10. Tests and quality closure.
11. Release evidence and rollout readiness.

---

## Mandatory Decision Gates (close early)

- Auth mode (OTP-only vs phone/password hybrid)
- Photo acquisition strategy
- Map/geocoding strategy
- PWA launch scope
- Analytics in MVP
- Rollout model (big-bang vs staged)

Track all in `01-master-tracker.md`.

---

## Quality Gates Contract

Use `04-quality-gates.md` as source of truth.

Minimum release expectation:

- `pnpm lint` pass
- `pnpm type-check` pass
- `pnpm test` pass
- `pnpm build` pass

---

## Decommission Contract (Phase 8)

Required outcomes:

- `frontend/apps/customer-app` deleted
- mobile CI jobs removed from workflow files
- mobile references removed from scripts/docs
- cleanup greps return clean/expected output

---

## Definition of Done

- customer web journey complete (login -> submit -> track -> result/follow-up)
- design parity with valuer-dashboard
- no mobile app or mobile CI remnants
- all quality gates green
- tracker evidence complete

---

## Usage Rule

If external planning file(s) are unavailable, execution must continue using this contract + files `00` to `10` in this folder.
