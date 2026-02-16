# Setup Guide (Canonical Pointer)

This file previously contained early MVP no-code setup notes.

For the current codebase, use the canonical setup documentation:

- [Local Setup](./docs/setup/local-setup.md)
- [Project Walkthrough](./docs/WALKTHROUGH.md)
- [Documentation Index](./docs/README.md)

## Quick Start

```bash
pnpm install
./scripts/dev-start.sh
```

Then run:

- Backend: `uvicorn app.main:app --reload --port 8000` (from `backend/`)
- Valuer Dashboard: `pnpm --filter @propflow/valuer-dashboard dev`
- Customer Portal: `pnpm --filter @propflow/customer-portal dev`
