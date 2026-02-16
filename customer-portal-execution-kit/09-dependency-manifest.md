# 09 - Dependency Manifest

This file tracks dependencies outside this folder and how they are managed.

---

## Dependency Policy

- Goal: keep execution guidance self-contained inside this folder.
- Reality: implementation work still requires target repo files.
- Management: preflight verification + fallback contracts + explicit dependency ownership.

---

## External Dependencies (Managed)

### A) Required repository paths (hard dependency)

These must exist for migration execution:

- `frontend/apps/customer-app` (source app; REMOVED in Phase 8)
- `frontend/apps/valuer-dashboard` (style/architecture baseline)
- `frontend/apps/customer-portal` (target app; expected by pre-Phase 8 and after Phase 8)
- `.github/workflows` (mobile cleanup in Phase 8)
- `scripts` (mobile reference cleanup in Phase 8)
- `README.md`, `SETUP-GUIDE.md`, `agent-onboarding.md` (doc cleanup)

### B) Required reference files (hard dependency)

- `frontend/apps/valuer-dashboard/next.config.js`
- `frontend/apps/valuer-dashboard/tsconfig.json`
- `frontend/apps/valuer-dashboard/eslint.config.mjs`
- `frontend/apps/valuer-dashboard/.env.example`
- `frontend/apps/valuer-dashboard/app/layout.tsx`
- `frontend/apps/valuer-dashboard/src/components/ClientLayout.tsx`
- `frontend/apps/valuer-dashboard/src/components/Sidebar.tsx`
- `frontend/apps/valuer-dashboard/src/components/TopBar.tsx`
- `frontend/apps/valuer-dashboard/app/globals.css`
- `frontend/apps/valuer-dashboard/app/login/page.tsx`
- `frontend/apps/valuer-dashboard/src/store/useAuthStore.ts`

### C) Optional reference (soft dependency)

- `plan-claude.md` (optional now; core contract is embedded in `11-local-execution-contract.md`)

---

## Dependency Risk Controls

1. Run stage-aware preflight:
   - `bash customer-portal-execution-kit/10-preflight-check.sh pre-phase1`
   - `bash customer-portal-execution-kit/10-preflight-check.sh pre-phase8`
   - `bash customer-portal-execution-kit/10-preflight-check.sh post-phase8`
2. If optional references are missing, continue using local contract files in this folder.
3. If hard dependencies are missing, mark phase `BLOCKED` and log in `06-issue-log.md`.
4. Never continue execution with unknown dependency state.

---

## Dependency Ownership

- Executor owns preflight validation each session.
- Tracker owner must record missing dependencies in `01-master-tracker.md` and `06-issue-log.md`.

---

## Current Status Baseline

- This kit is self-contained for process, prompts, quality, and tracking.
- External dependencies are now explicit, validated through preflight, and failure-managed.
