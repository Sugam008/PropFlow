# 00 - Agent Loop (Strict)

Use this exact loop for every execution session. This is optimized for lower-capability agents and minimizes drift.

---

## Session Rules (Non-Negotiable)

1. One phase per session. Never mix phases.
2. Max 3 code files changed before running a check.
3. No large rewrites when copy-then-adapt is possible.
4. If a check fails 3 times, stop and log a blocker in `06-issue-log.md`.
5. Update `01-master-tracker.md` after each checkpoint.

---

## Session Bootstrap (5 minutes)

1. Confirm active phase in `01-master-tracker.md`.
2. Read these files in order:
   - `customer-portal-execution-kit/11-local-execution-contract.md`
   - `customer-portal-execution-kit/01-master-tracker.md`
   - `customer-portal-execution-kit/02-phase-playbooks.md`
   - `customer-portal-execution-kit/04-quality-gates.md`
3. Optional: cross-check with `plan-claude.md` if present.
4. Confirm unresolved blockers in `06-issue-log.md`.
5. Write session header in tracker:
   - Session ID (YYYY-MM-DD-HHMM)
   - Phase
   - Goal for this session

### Phase Entry Gate (must pass before editing)

- Decision gates required for this phase are resolved.
- Prior phase status is `DONE` (except for Phase 1).
- No unresolved blocker that directly impacts current phase.
- Last known required command state is understood (pass/fail).

---

## Micro-Execution Cycle

Repeat until phase complete.

### Step A - Plan tiny batch

- Define 1-3 concrete edits.
- Define expected verification for those edits.

### Step B - Execute tiny batch

- Implement only planned edits.
- Keep each file under ~300 lines where practical.
- Prefer copying baseline dashboard files first, then minimal adaptation.

### Step C - Run local check immediately

- Type check (app level).
- If UI route changed, run app and manually check route behavior.

### Step D - Record result

In `01-master-tracker.md`, append:

- what was changed
- check output status (pass/fail)
- next tiny batch

---

## End-of-Phase Protocol

1. Run mandatory phase checks from `04-quality-gates.md`.
2. If all pass, commit with exact message style:
   - `Phase N: <short description>`
3. Record commit hash and evidence in `01-master-tracker.md`.
4. If any check fails, do not commit phase as complete.
5. Add handoff packet using `08-handoff-and-recovery.md` template.

---

## Hard Stop Conditions

Stop and log blocker if any of the following happens:

- Unknown imports or APIs cannot be confirmed.
- Command failures persist after 3 focused fixes.
- Changes begin crossing phase boundaries.
- Required decision gate is unresolved (auth mode, rollout mode, etc.).

When stopped, create a blocker entry in `06-issue-log.md` with:

- root cause
- exact failing command
- minimal proposed fix

---

## Anti-Hallucination Checklist (before each commit)

- Imported symbols exist in source package export.
- File paths exist and are correct.
- API routes match `11-local-execution-contract.md`.
- No React Native / Expo imports in web app files.
- Verification commands executed and recorded.

---

## Session Exit Template

At the end of every session, leave this note in tracker:

- Completed:
- Remaining in phase:
- Blocking issues:
- Next first action:
