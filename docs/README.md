# PropFlow Documentation Index

This folder contains the **canonical project documentation**.

## Start Here

New to the project? Use the comprehensive onboarding guides:

- **[Human Onboarding](./Human%20Onboarding/)** - Complete guides for new developers
  - [Getting Started](./Human%20Onboarding/01-getting-started.md) - Setup and first steps
  - [Architecture Deep Dive](./Human%20Onboarding/02-architecture-deep-dive.md) - System design
  - [Backend Guide](./Human%20Onboarding/03-backend-guide.md) - Python/FastAPI development
  - [Frontend Guide](./Human%20Onboarding/04-frontend-guide.md) - React/Next.js/React Native
  - [Testing Guide](./Human%20Onboarding/05-testing-guide.md) - Testing strategies
  - [Deployment & Ops](./Human%20Onboarding/06-deployment-ops.md) - CI/CD and operations
  - [Business Domain](./Human%20Onboarding/07-business-domain.md) - Domain model and workflows
  - [Development Workflow](./Human%20Onboarding/08-development-workflow.md) - Git, code style, PRs
  - [Troubleshooting](./Human%20Onboarding/09-troubleshooting.md) - Common issues and fixes
  - [Quick Reference](./Human%20Onboarding/10-quick-reference.md) - Commands and patterns

- **[Agent Onboarding](../agent-onboarding.md)** - Context for AI assistants

## Reference Documentation

| Category        | Description                                                    |
| --------------- | -------------------------------------------------------------- |
| `architecture/` | Architecture Decision Records (ADRs), API design, domain model |
| `product/`      | Backlog, acceptance criteria, screen inventory                 |
| `ops/`          | Runbooks, monitoring, KPI tracking                             |
| `testing/`      | Integration tests, device matrix checklist                     |
| `security/`     | Security hardening guide                                       |
| `archive/`      | Legacy planning documents                                      |

## Quick Links

| Document                                     | Purpose                                          |
| -------------------------------------------- | ------------------------------------------------ |
| [process.md](./process.md)                   | Engineering cadence, quality bars, risk register |
| [design-contracts.md](./design-contracts.md) | UI components, state management, accessibility   |
| [roadmap.md](./roadmap.md)                   | Future feature roadmap                           |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PropFlow Architecture                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐         │
│  │   Customer   │    │    Valuer    │    │   Admin   │         │
│  │     App      │    │  Dashboard   │    │  Portal   │         │
│  │ (React       │    │  (Next.js)   │    │           │         │
│  │  Native)     │    │              │    │           │         │
│  └──────┬───────┘    └──────┬───────┘    └─────┬─────┘         │
│         │                   │                    │               │
│         └───────────────────┼────────────────────┘               │
│                             │                                    │
│                     ┌───────▼───────┐                           │
│                     │  API Gateway  │                           │
│                     │   (FastAPI)   │                           │
│                     └───────┬───────┘                           │
│                             │                                    │
│         ┌───────────────────┼───────────────────┐               │
│         │                   │                   │               │
│  ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐       │
│  │  Database   │     │    Redis    │     │     S3      │       │
│  │ (PostgreSQL)│     │   (Cache)   │     │   (MinIO)   │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```
