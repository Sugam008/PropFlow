# 07 - Design Rationale

This file explains why the execution kit is structured this way and how it protects quality for a lower-capability executor.

---

## Primary objective

Deliver a high-quality customer web portal from `11-local-execution-contract.md` with predictable execution and minimal rework.

---

## Design principles

1. **Deterministic progress over creative freedom**
   - Lower-capability models perform better with constrained paths.
   - The kit enforces one-phase sessions and fixed verification gates.

2. **Small-batch execution**
   - Limits context overload and reduces cascading mistakes.
   - The loop requires frequent checks after tiny edit batches.

3. **Objective completion criteria**
   - “Looks done” is disallowed.
   - A phase completes only with gate commands + evidence logged.

4. **Copy-then-adapt parity strategy**
   - Style and architecture parity with valuer-dashboard is required.
   - Baseline file reuse reduces divergence and design drift.

5. **Interruption-safe execution**
   - Sessions can stop/resume without losing state through tracker + handoff protocol.

---

## Guardrail matrix

| Failure Mode                | Typical Cause                 | Guardrail                                            | File                                        |
| --------------------------- | ----------------------------- | ---------------------------------------------------- | ------------------------------------------- |
| Context drift               | Long unfocused sessions       | One phase/session + micro-batches                    | `00-agent-loop.md`                          |
| Hallucinated imports/APIs   | Guessing symbols/routes       | Anti-hallucination checklist + read-first discipline | `00-agent-loop.md`, `02-phase-playbooks.md` |
| Premature phase completion  | Missing objective checks      | Mandatory phase gates                                | `04-quality-gates.md`                       |
| Weak traceability           | No evidence capture           | Evidence ledger + session log                        | `01-master-tracker.md`                      |
| Stuck error loops           | Repeated blind fixes          | 3-attempt failure protocol + blocker log             | `04-quality-gates.md`, `06-issue-log.md`    |
| Inconsistent handoffs       | Missing session context       | Resume protocol and handoff template                 | `08-handoff-and-recovery.md`                |
| Style drift from target app | Re-implementation from memory | Copy-then-adapt from valuer baseline                 | `02-phase-playbooks.md`                     |

---

## Why one folder is optimal here

- Single source of operational truth.
- Easy for external executor model to consume in-order.
- No split-brain between docs/prompts/checklists.
- Strongly aligned with your requirement: one folder for execution + tracking.

---

## Quality strategy for “extremely well built” output

The kit targets excellence through process controls instead of vague instructions:

- **Architecture quality**: enforced parity and typed constraints.
- **Behavior quality**: route and flow checks per phase.
- **Delivery quality**: command gates and evidence capture.
- **Operational quality**: blocker handling and resume safety.

If all controls are followed, final output quality becomes reproducible, not accidental.
