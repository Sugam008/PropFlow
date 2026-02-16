# Customer Portal Execution Kit

This folder is the single control center to execute the customer portal migration end-to-end with a lower-capability agent model (Gemini 3 Flash) while maintaining high implementation quality.

It is designed to prevent common agent failures: context drift, oversized edits, skipped verification, and weak tracking.

## Why this design is the best fit

This kit is intentionally structured as an **execution control plane** with three layers:

1. **Control layer** - strict loop + tracker (`00`, `01`) to prevent drift.
2. **Execution layer** - phase playbooks + prompts (`02`, `03`) to reduce ambiguity.
3. **Assurance layer** - quality gates + issue log (`04`, `06`) to enforce objective completion.

For a lower-capability model, this is critical: it minimizes interpretation freedom and maximizes deterministic progress.

## What this kit contains

1. `00-agent-loop.md` - strict execution loop for every session.
2. `01-master-tracker.md` - source of truth for status, decisions, evidence, and completion.
3. `02-phase-playbooks.md` - phase-by-phase, file-level execution playbooks.
4. `03-session-prompts.md` - copy-paste prompts per phase for Gemini 3 Flash.
5. `04-quality-gates.md` - quality bar, checks, and failure protocol.
6. `05-gemini-root-context-template.md` - template to copy into repo root as `GEMINI.md`.
7. `06-issue-log.md` - blocker and defect log template.
8. `07-design-rationale.md` - architecture rationale and guardrail mapping.
9. `08-handoff-and-recovery.md` - interruption-safe resume and recovery protocol.
10. `09-dependency-manifest.md` - hard/soft dependency inventory and controls.
11. `10-preflight-check.sh` - hard dependency preflight validator.
12. `11-local-execution-contract.md` - self-contained migration contract (primary reference).
13. `12-gemini-3-flash-profile.md` - model-specific tuning and execution guidance.

## Non-negotiable execution rules

- Execute exactly one phase per session.
- Do not continue a phase if required checks are failing.
- Use copy-then-adapt from `frontend/apps/valuer-dashboard` where instructed.
- Keep edits focused; avoid rewriting entire files for small changes.
- Update `01-master-tracker.md` after every meaningful action.

## Quality target

This kit targets a build that is not just complete, but **production-grade within scope**:

- design parity with valuer-dashboard
- stable typed architecture and clean build gates
- resilient flow behavior (draft restore, auth guard, fallback paths)
- no residual mobile stack references after decommission

## Quick start

1. Read `11-local-execution-contract.md` (primary contract).
2. (Optional) Cross-check with `plan-claude.md` if available.
3. Run `bash customer-portal-execution-kit/10-preflight-check.sh pre-phase1`.
4. Copy `05-gemini-root-context-template.md` into `/GEMINI.md` at repo root.
5. Open `01-master-tracker.md` and set:
   - branch name
   - execution owner
   - current phase (`Phase 1` initially)
6. Start the loop from `00-agent-loop.md`.
7. Use prompt for active phase from `03-session-prompts.md`.
8. Run checks from `04-quality-gates.md`.
9. Record evidence and commit hash in `01-master-tracker.md`.
10. If interrupted, resume using `08-handoff-and-recovery.md`.

## External dependency handling

- Process dependency has been localized to this folder.
- `plan-claude.md` is now optional; fallback is `11-local-execution-contract.md`.
- Repository code dependencies are validated via `10-preflight-check.sh` (stage-aware).

## Gemini 3 Flash alignment

- Model-specific research and settings are captured in `12-gemini-3-flash-profile.md`.
- Default execution stance: `thinking_level=high`, `temperature=1.0`, concise prompts.
- For decommission checks: run preflight again with `pre-phase8` and `post-phase8`.

## Required final outcome

- Customer journey fully web-based in `frontend/apps/customer-portal`.
- `frontend/apps/customer-app` fully removed.
- No mobile references in CI/CD and docs.
- Lint, type-check, test, and build all pass.

## Definition of done handshake

Before declaring complete, all boxes in `01-master-tracker.md` must be checked and all final evidence captured.
