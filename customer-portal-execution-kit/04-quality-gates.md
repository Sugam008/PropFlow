# 04 - Quality Gates

These gates define objective pass/fail criteria for each phase.

---

## Command Conventions

- Run app-level checks with `pnpm -C <app-dir> ...`
- Run monorepo checks from repo root.
- Record PASS/FAIL in `01-master-tracker.md` evidence ledger.

## Anti-Greenwashing Rule

Never mark a gate PASS without evidence.

- Command checks require command output confirmation.
- Manual checks require concise notes and artifact reference (screenshot/video/log).
- If evidence is missing, gate remains FAIL/INCOMPLETE.

---

## Phase Gates

### Phase 1 Gate

Required:

```bash
pnpm -C frontend/apps/customer-portal install
pnpm -C frontend/apps/customer-portal type-check
pnpm -C frontend/apps/customer-portal build
```

Pass criteria:

- no TypeScript errors
- build succeeds without fatal errors

### Phase 2 Gate

Required:

```bash
pnpm -C frontend/apps/customer-portal type-check
pnpm -C frontend/apps/customer-portal dev
```

Pass criteria:

- shell renders and navigation routes are wired
- visuals align with valuer-dashboard baseline style

### Phase 3 Gate

Required:

```bash
pnpm -C frontend/apps/customer-portal type-check
```

Manual checks:

- login works with expected credentials
- protected routes redirect unauthenticated users to `/login`
- logout clears session

### Phase 4 Gate

Required:

```bash
pnpm -C frontend/apps/customer-portal type-check
```

Manual checks:

- all wizard steps render
- data persists while navigating steps
- draft restore works after refresh
- submit action completes flow

### Phase 5 Gate

Required:

```bash
pnpm -C frontend/apps/customer-portal type-check
```

Manual checks:

- home listing loads
- property detail renders
- result page renders
- follow-up page renders

### Phase 6 Gate

Required:

```bash
pnpm -C frontend/apps/customer-portal type-check
```

Manual checks:

- API base URL usage is environment-driven
- websocket provider mounts without runtime error

### Phase 7 Gate

Required:

```bash
pnpm -C frontend/apps/customer-portal type-check
```

Manual checks:

- no unnecessary duplicate components from shared package
- required customer-specific components compile and render

### Phase 8 Gate (decommission)

Required:

```bash
grep -R "customer-app" .github/workflows scripts README.md SETUP-GUIDE.md || true
grep -R "expo\|react-native\|eas\|run:android\|run:ios" frontend apps scripts .github || true
test ! -d frontend/apps/customer-app && echo "customer-app removed"
pnpm lint
pnpm type-check
pnpm build
```

Pass criteria:

- grep outputs are clean or expected
- customer-app directory no longer exists
- monorepo checks pass

### Phase 9 Gate

Required:

```bash
pnpm -C frontend/apps/customer-portal type-check
```

Manual checks:

- responsive behavior verified at 375/768/1280
- keyboard navigation and focus visibility confirmed

### Phase 10 Gate

Required:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

Pass criteria:

- all commands pass in monorepo

### Phase 11 Gate

Required:

- all tracker definition-of-done checkboxes checked
- release evidence links/notes present
- rollback reference documented

---

## Failure Protocol

If any required command fails:

1. Capture command + error in tracker.
2. Attempt smallest root-cause fix.
3. Re-run only failing command.
4. If still failing after 3 attempts, log blocker in `06-issue-log.md` and stop phase.

---

## Commit Rules

Only commit when phase gate passes.

Commit message format:

- `Phase N: <short description>`

Example:

- `Phase 4: Multi-step valuation wizard`

---

## Minimum Manual Evidence by Phase

- Phase 2: screenshot of shell with sidebar/topbar.
- Phase 3: login success + protected redirect behavior note.
- Phase 4: wizard completion trace (step-by-step note).
- Phase 5: route render notes for listing/detail/result/follow-up.
- Phase 8: grep cleanup outputs and directory deletion confirmation.
- Phase 9: viewport notes for 375/768/1280 and accessibility checks.
- Phase 11: release evidence bundle reference.
