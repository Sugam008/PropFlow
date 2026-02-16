# 03 - Session Prompts (Copy-Paste)

Use these prompts directly with Gemini 3 Flash. Keep temperature at default.

---

## Universal Session Starter Prompt

```text
You are executing the customer portal migration for PropFlow using the local execution kit contract.

Runtime settings:
- Model: gemini-3-flash-preview
- thinking_level: high
- temperature: 1.0 (default; do not lower)

Hard rules:
1) Execute exactly ONE phase this session.
2) Use copy-then-adapt from valuer-dashboard where instructed.
3) Never rewrite whole files for small changes.
4) After every 1-3 file edits, run type-check.
5) If failing 3 times on same issue, stop and log blocker.
6) Update tracker files after each checkpoint.
7) Do not claim a phase is complete without listing required gate commands and their PASS status.
8) Keep prompts concise and direct; do not over-engineer chain-of-thought prompts.

Read these first:
- customer-portal-execution-kit/11-local-execution-contract.md
- customer-portal-execution-kit/00-agent-loop.md
- customer-portal-execution-kit/01-master-tracker.md
- customer-portal-execution-kit/02-phase-playbooks.md
- customer-portal-execution-kit/04-quality-gates.md

Optional reference if available:
- plan-claude.md

If large context is provided, place your exact task instruction at the end of the prompt.

Output format for this session:
A) Session plan (max 5 bullets)
B) Edit batches executed
C) Command results (PASS/FAIL)
D) Tracker updates made
E) Next first action for next session
F) Handoff packet
```

---

## Phase 1 Prompt

```text
Execute Phase 1 only.
Goal: scaffold `frontend/apps/customer-portal` from valuer-dashboard baseline and reach clean type-check/build. (Legacy: Customer app removed)

Required steps:
1) Create customer-portal app structure by copying baseline config from valuer-dashboard.
2) Align package dependencies to dashboard web stack and shared workspace packages.
3) Copy/adapt customer app stores and API layer for web (remove RN/Expo imports). (Use repo history if files missing)
4) Run:
   - pnpm -C frontend/apps/customer-portal install
   - pnpm -C frontend/apps/customer-portal type-check
   - pnpm -C frontend/apps/customer-portal build
5) Update tracker and provide commit-ready summary.

Do not start Phase 2.
```

## Phase 2 Prompt

```text
Execute Phase 2 only.
Goal: match valuer-dashboard shell exactly for customer portal.

Read these before coding:
- frontend/apps/valuer-dashboard/app/layout.tsx
- frontend/apps/valuer-dashboard/src/components/ClientLayout.tsx
- frontend/apps/valuer-dashboard/src/components/Sidebar.tsx
- frontend/apps/valuer-dashboard/src/components/TopBar.tsx
- frontend/apps/valuer-dashboard/app/globals.css

Implement customer-portal equivalents with customer route labels.
Run type-check and dev visual verification.
Update tracker with evidence.

Do not start Phase 3.
```

## Phase 3 Prompt

```text
Execute Phase 3 only.
Goal: authentication flow with protected routes.

Copy-then-adapt from valuer dashboard login page and auth store.
Set storage key to `propflow-customer-auth` and role handling for CUSTOMER.
Ensure hydration-safe auth guard in ClientLayout.
Run type-check and manual login verification.
Update tracker and stop.
```

## Phase 4 Prompt

```text
Execute Phase 4 only.
Goal: full multi-step valuation wizard.

Mandatory split:
- Session 4a: Stepper + /new + /new/details
- Session 4b: /new/location + /new/photos
- Session 4c: /new/review + property store integration

For each sub-session:
- Edit max 3 files, then type-check
- Keep components focused and typed
- Ensure persistence and step state are stable

After final sub-session, perform full wizard manual walk-through and update tracker.
Do not start Phase 5.
```

## Phase 5 Prompt

```text
Execute Phase 5 only.
Goal: implement status/result/follow-up customer journey pages.

Create:
- app/page.tsx
- app/property/[id]/page.tsx
- app/property/[id]/result/page.tsx
- app/property/[id]/follow-up/page.tsx

Match style from valuer dashboard patterns.
Run type-check and manual route checks.
Update tracker and stop.
```

## Phase 6 Prompt

```text
Execute Phase 6 only.
Goal: finalize API/services layer for web.

Implement/verify:
- src/api/client.ts
- src/api/auth.ts
- src/api/property.ts
- src/providers/WebSocketProvider.tsx

Remove any RN/Expo assumptions.
Run type-check. Update tracker with endpoint verification notes.
Do not start Phase 7.
```

## Phase 7 Prompt

```text
Execute Phase 7 only.
Goal: component/form/provider completeness without duplication.

Before creating any component, check if it already exists in @propflow/ui.
Create only missing customer-specific components/forms.
Run type-check and update tracker.
Stop after phase completion.
```

## Phase 8 Prompt

```text
Execute Phase 8 only. This is deletion/cleanup phase.

Precondition:
- Phases 1-7 must be marked DONE in tracker.

Actions:
1) Delete frontend/apps/customer-app
2) Remove mobile jobs from:
   - .github/workflows/ci.yml
   - .github/workflows/deploy.yml
   - .github/workflows/deploy-local.yml
3) Update scripts/docs replacing mobile references.
4) Run cleanup checks from quality gates.

If any cleanup grep still finds mobile refs, keep fixing until clean.
Update tracker and stop.
```

## Phase 9 Prompt

```text
Execute Phase 9 only.
Goal: responsive polish + animation + a11y + SEO baseline.

Do not restructure architecture.
Focus only on:
- breakpoints (375 / 768 / 1280)
- meaningful micro-interactions
- ARIA/focus/keyboard support
- page metadata and core SEO artifacts

Run type-check and viewport verification notes in tracker.
```

## Phase 10 Prompt

```text
Execute Phase 10 only.
Goal: testing and quality closure.

Add/align tests for critical flows:
- auth store
- property store
- login flow
- wizard submission

Run and record:
- pnpm lint
- pnpm type-check
- pnpm test
- pnpm build

No Phase 11 work in this session.
```

## Phase 11 Prompt

```text
Execute Phase 11 only.
Goal: release readiness and evidence package.

Collect:
- staging/UAT evidence
- route acceptance proof
- rollback commit/tag reference

Ensure all final Definition of Done checkboxes are complete in tracker.
Then provide concise release summary.
```

---

## Emergency Recovery Prompt (when stuck)

```text
I am stuck in a loop. Pause coding.

1) Identify root cause in one sentence.
2) Show the exact failing command and top 10 relevant lines.
3) Propose the smallest possible fix.
4) Apply only that fix.
5) Re-run only the failing check.
6) Update blocker log and tracker.

Do not make unrelated edits.
```

---

## Phase Completion Declaration Template

Use this exact format when claiming a phase is complete:

```text
Phase Completion Declaration
- Phase: <N>
- Required gate commands executed:
  - <command>: PASS/FAIL
  - <command>: PASS/FAIL
- Manual checks completed:
  - <check>: PASS/FAIL
- Tracker updated:
  - Phase Board: yes/no
  - Evidence Ledger: yes/no
  - Session Log + Handoff packet: yes/no
- Commit-ready summary:
```
