# 06 - Issue Log

Track blockers, defects, and unresolved risks.

---

## Open Blockers

| ID      | Date | Phase | Severity | Type | Summary | Root Cause | Failing Command | Owner | Status |
| ------- | ---- | ----- | -------- | ---- | ------- | ---------- | --------------- | ----- | ------ |
| BLK-001 |      |       |          |      |         |            |                 |       | OPEN   |

Status values:

- `OPEN`
- `IN_PROGRESS`
- `RESOLVED`
- `WONT_FIX`

Type values:

- `Build`
- `Type`
- `Lint`
- `Runtime`
- `Test`
- `DesignParity`
- `DataContract`
- `Process`

Severity values:

- `Critical`
- `High`
- `Medium`
- `Low`

---

## Issue Detail Template

### [ISSUE_ID] - <short title>

- Date:
- Phase:
- Reporter:
- Severity:
- Type:

#### Symptom

<What failed>

#### Evidence

- Command:
- Output excerpt:
- Affected files:

#### Root Cause (one sentence)

<Why it failed>

#### Minimal Fix Plan

1.
2.
3.

#### Resolution

- Fix applied:
- Validation command:
- Validation result:
- Resolved date:

---

## Known Risks Watchlist

| Risk                       | Trigger                       | Mitigation                          | Current State |
| -------------------------- | ----------------------------- | ----------------------------------- | ------------- |
| Auth mode unresolved       | Login implementation diverges | Decide gate before Phase 3          | OPEN          |
| Geolocation variance       | Browser denies permission     | Manual address + marker fallback    | OPEN          |
| Mobile cleanup misses refs | Residual CI/docs mentions     | Run decommission grep gates         | OPEN          |
| Style drift                | Dashboard parity breaks       | Copy-then-adapt baseline components | OPEN          |

---

## Retrospective Notes

Use this section after each phase to prevent repeat failures.

- Phase:
- What went wrong:
- Why it happened:
- Guardrail added:
