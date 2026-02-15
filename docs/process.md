# Engineering Process

## Cadence

- **Daily Standup**: 10:00 AM (Status, Blockers, Next Steps)
- **Weekly Demo**: Fridays at 4:00 PM (Stakeholder walkthrough)
- **Architecture Review**: Ad-hoc, triggered by new ADRs
- **Risk Review**: Bi-weekly

## Development Workflow

- **Branching**: Feature branches (`feat/`, `fix/`, `chore/`)
- **Merge Policy**:
  - No merge to `main` without passing CI (Lint, Types, Tests)
  - Minimum 1 peer review for PRs
- **Commits**: Conventional Commits (`type(scope): description`)

## Quality Bars

| Area          | Standard                                  |
| ------------- | ----------------------------------------- |
| Test Coverage | > 80% for backend core logic              |
| Linting       | Strict Ruff (Python), ESLint (TypeScript) |
| Type Checking | Strict mode enabled                       |
| Accessibility | WCAG 2.1 AA compliance                    |

## Severity Matrix

| Severity      | Definition                                  | Target Fix Time |
| ------------- | ------------------------------------------- | --------------- |
| P0 (Critical) | Ship-blocker, data loss, security breach    | Immediate       |
| P1 (High)     | Release-blocker, major feature broken       | < 24 hours      |
| P2 (Medium)   | Feature partially broken, workaround exists | < 3 days        |
| P3 (Low)      | Cosmetic issues, minor UX friction          | Backlog         |

## Active Risks

| ID    | Risk                       | Impact | Mitigation                                      |
| ----- | -------------------------- | ------ | ----------------------------------------------- |
| R-001 | GPS Spoofing               | High   | Multi-factor verification (EXIF + GPS + Signal) |
| R-002 | Large Photo Upload Latency | Medium | Client-side compression, background upload      |
| R-003 | UI Divergence (Mobile/Web) | Low    | Shared theme tokens, component library          |
| R-004 | Valuer Feedback Delay      | High   | WebSocket notifications, SLA tracking           |
