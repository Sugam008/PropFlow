# 08 - Handoff and Recovery Protocol

Use this when a session is interrupted or execution moves to a new agent/session.

---

## Handoff packet (must be updated at session end)

Copy this template into `01-master-tracker.md` Session Log entry notes.

```text
Handoff Packet
- Active Phase:
- Session ID:
- Completed this session:
- Files changed:
- Commands run + PASS/FAIL:
- Open blocker IDs:
- Next exact first action:
- Risks to watch next session:
```

---

## Fast resume checklist (new session)

1. Read last Session Log row in `01-master-tracker.md`.
2. Read any OPEN blocker in `06-issue-log.md`.
3. Confirm current phase status in Phase Board.
4. Re-run last failing command first (if prior session ended with failure).
5. Continue from “Next exact first action” only.

---

## Recovery when state is unclear

If tracker is stale or ambiguous:

1. Set phase status to `BLOCKED` in tracker.
2. Reconstruct truth using commands:
   - app type-check
   - app build
   - relevant manual route checks
3. Update evidence ledger with current reality.
4. Write a corrected handoff packet.
5. Resume only after uncertainty is removed.

---

## Command crash recovery

If command output is partial or terminal crashes:

1. Do not assume PASS.
2. Re-run command and capture a fresh result.
3. Log result in evidence ledger.

---

## Partial commit recovery

If code changed but phase not complete:

- Keep phase `IN_PROGRESS`.
- Do not mark checklist items complete prematurely.
- Resume with smallest failing/remaining item.

---

## Cross-phase contamination rule

If work from next phase appears in current phase:

1. Stop new edits.
2. Record contamination in issue log (`Type: Process`).
3. Either:
   - finish current phase gates first, or
   - isolate unrelated work before continuing.

Never close current phase with unresolved cross-phase spillover.
