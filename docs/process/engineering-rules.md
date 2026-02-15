# Engineering Rules & Cadence: PropFlow

## Cadence
- **Daily Standup**: 10:00 AM (Status, Blockers, Next Steps).
- **Weekly Demo**: Fridays at 4:00 PM (Stakeholder walkthrough of completed steps).
- **Architecture Review**: Ad-hoc, triggered by new ADRs.
- **Risk Review**: Bi-weekly.

## Development Workflow
- **Branching Strategy**: Use feature branches (`feat/`, `fix/`, `chore/`).
- **Merge Policy**:
  - No merge to `main` without passing CI (Lint, Types, Tests).
  - Minimum 1 peer review for manual PRs.
  - Agent-led changes must follow the `AGENT_LOOP.md` verification steps.
- **Commit Conventions**: Conventional Commits (`type(scope): description`).

## Quality Bars
- **Test Coverage**: > 80% for backend core logic.
- **Linting**: Strict Ruff rules for Python, ESLint for TypeScript.
- **Type Checking**: Strict mode enabled for TypeScript and Pydantic.
- **Accessibility**: WCAG 2.1 AA compliance required for all new UI components.

## Severity Matrix

| Severity | Definition | Target Fix Time |
|----------|------------|-----------------|
| **P0 (Critical)** | Ship-blocker. Data loss, security breach, or core flow broken. | Immediate |
| **P1 (High)** | Release-blocker. Major feature broken, no workaround. | < 24 hours |
| **P2 (Medium)** | Should-fix. Feature partially broken, workaround exists. | < 3 days |
| **P3 (Low)** | Nice-to-have. Cosmetic issues, minor UX friction. | Backlog |
