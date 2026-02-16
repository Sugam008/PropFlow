# 02 - Phase Playbooks

These playbooks operationalize `11-local-execution-contract.md` into execution-ready checklists for a lower-capability model.

---

## Phase 1 - Planning and Scaffolding

### Goal

Create `frontend/apps/customer-portal` from valuer-dashboard baseline and get first clean type/build.

### Read First

- `frontend/apps/customer-portal` (web reference)
- `frontend/apps/valuer-dashboard/next.config.js`
- `frontend/apps/valuer-dashboard/tsconfig.json`
- `frontend/apps/valuer-dashboard/eslint.config.mjs`
- `frontend/apps/valuer-dashboard/.env.example`
- `frontend/apps/customer-portal/src/store/useAuthStore.ts` (if exists)
- `frontend/apps/customer-portal/src/store/usePropertyStore.ts` (if exists)
- `frontend/apps/customer-portal/src/api/*` (if exists)

### Deliverables

- New Next.js app directory `frontend/apps/customer-portal`
- package scripts/dependencies aligned with dashboard stack
- Initial copied/adapted store + API + analytics files

### Verification

- `pnpm -C frontend/apps/customer-portal install`
- `pnpm -C frontend/apps/customer-portal type-check`
- `pnpm -C frontend/apps/customer-portal build`

---

## Phase 2 - Core Layout and Design System

### Goal

Match valuer-dashboard shell exactly with customer labels and routes.

### Read First

- `frontend/apps/valuer-dashboard/app/layout.tsx`
- `frontend/apps/valuer-dashboard/src/components/ClientLayout.tsx`
- `frontend/apps/valuer-dashboard/src/components/Sidebar.tsx`
- `frontend/apps/valuer-dashboard/src/components/TopBar.tsx`
- `frontend/apps/valuer-dashboard/app/globals.css`

### Deliverables

- `app/layout.tsx`
- `src/components/ClientLayout.tsx`
- `src/components/Sidebar.tsx`
- `src/components/TopBar.tsx`
- `app/globals.css`

### Verification

- `pnpm -C frontend/apps/customer-portal type-check`
- `pnpm -C frontend/apps/customer-portal dev` (visual check)

---

## Phase 3 - Authentication

### Goal

Implement working login/logout and protected route behavior.

### Read First

- `frontend/apps/valuer-dashboard/app/login/page.tsx`
- `frontend/apps/valuer-dashboard/src/store/useAuthStore.ts`

### Deliverables

- `app/login/page.tsx`
- `src/store/useAuthStore.ts` (`propflow-customer-auth` key)
- auth guard behavior in `ClientLayout`

### Verification

- `pnpm -C frontend/apps/customer-portal type-check`
- manual login flow test

---

## Phase 4 - Multi-Step Valuation Flow

### Goal

Implement full wizard flow with persistence and submit.

### Deliverables

- `app/new/page.tsx`
- `app/new/details/page.tsx`
- `app/new/location/page.tsx`
- `app/new/photos/page.tsx`
- `app/new/review/page.tsx`
- `src/components/Stepper.tsx`
- `src/store/usePropertyStore.ts`

### Sub-session split (required)

- 4a: Stepper + Property Type + Details
- 4b: Location + Photos
- 4c: Review + Store integration

### Verification

- `pnpm -C frontend/apps/customer-portal type-check`
- manual end-to-end wizard walk-through

---

## Phase 5 - Property Status and Results

### Goal

Implement post-submission journey.

### Deliverables

- `app/page.tsx`
- `app/property/[id]/page.tsx`
- `app/property/[id]/result/page.tsx`
- `app/property/[id]/follow-up/page.tsx`

### Verification

- `pnpm -C frontend/apps/customer-portal type-check`
- manual route render and transitions

---

## Phase 6 - API and Services

### Goal

Finalize web-safe API layer and websocket integration.

### Deliverables

- `src/api/client.ts`
- `src/api/auth.ts`
- `src/api/property.ts`
- `src/providers/WebSocketProvider.tsx`

### Verification

- `pnpm -C frontend/apps/customer-portal type-check`

---

## Phase 7 - Component Library

### Goal

Add only missing components needed for customer journey.

### Deliverables

- customer-specific components
- form components
- providers aligned to dashboard

### Guardrail

Check `@propflow/ui` exports before creating any duplicate component.

### Verification

- `pnpm -C frontend/apps/customer-portal type-check`

---

## Phase 8 - Mobile Decommission

### Goal

Remove RN/Expo app and all mobile CI/docs/scripts references.

### Deliverables

- delete `frontend/apps/customer-app`
- remove mobile jobs from CI workflows
- update docs and scripts

### Verification

- grep checks for mobile keywords
- monorepo lint/type-check/build

### Safety Rule

Do not execute Phase 8 until Phases 1-7 are complete and validated.

---

## Phase 9 - Polish

### Goal

Responsive and quality polish without restructuring core architecture.

### Deliverables

- breakpoint tuning
- animation polish
- SEO/meta baseline
- accessibility fixes

### Verification

- viewports: 375, 768, 1280
- `pnpm -C frontend/apps/customer-portal type-check`

---

## Phase 10 - Testing and Quality

### Goal

Add tests for critical flows and pass all monorepo quality gates.

### Deliverables

- unit tests for stores/components/api
- e2e for login + wizard + status path

### Verification

- `pnpm lint`
- `pnpm type-check`
- `pnpm test`
- `pnpm build`

---

## Phase 11 - Release and Rollout

### Goal

Prepare rollout evidence and release readiness.

### Deliverables

- staging validation record
- UAT evidence
- rollback reference commit/tag

### Verification

- all checklist items in `01-master-tracker.md` are checked
- release evidence complete
