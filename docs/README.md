# PropFlow Documentation Index

This folder contains the **canonical project documentation**.

## Start Here

1. [Project Walkthrough](./WALKTHROUGH.md)
2. [Local Setup](./setup/local-setup.md)
3. [API Design](./architecture/api-design.md)

## Core Docs

| Category           | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| `architecture/`    | System design, ADRs, domain model, API contracts, lifecycle, UX/a11y contracts |
| `product/`         | Backlog, acceptance criteria, screen inventory, state machine                  |
| `process/`         | Engineering rules and risk register                                            |
| `setup/`           | Local setup and environment instructions                                       |
| `ops/`             | Deployment, runbooks, monitoring, KPI tracking                                 |
| `security/`        | Security hardening guide                                                       |
| `testing/`         | Integration tests, device matrix checklist                                     |
| `design/`          | Component contracts, state contracts                                           |
| `api/openapi.yaml` | OpenAPI source for backend API                                                 |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PropFlow Architecture                │
├─────────────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │  Customer   │    │    Valuer    │    │  Admin   │  │
│  │    App      │    │  Dashboard   │    │  Portal  │  │
│  │  (React    │    │  (Next.js)   │    │           │  │
│  │   Native)   │    │              │    │           │  │
│  └──────┬───────┘    └──────┬───────┘    └─────┬─────┘  │
│         │                    │                     │        │
│         └──────────────────┼─────────────────────┘        │
│                            │                              │
│                    ┌───────▼───────┐                    │
│                    │  API Gateway  │                    │
│                    │   (FastAPI)   │                    │
│                    └───────┬───────┘                    │
│                            │                              │
│         ┌────────────────┼────────────────┐            │
│         │                │                │            │
│  ┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐   │
│  │  Database   │ │   Redis   │ │     S3      │   │
│  │ (PostgreSQL)│ │ (Cache)   │ │  (MinIO)    │   │
│  └─────────────┘ └───────────┘ └─────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Key Features

### Customer Mobile App (Phase 4)

- OTP-based authentication
- Property submission with camera-only photo capture
- Real-time status tracking via WebSocket
- GPS location capture with validation

### Valuer Dashboard (Phase 5)

- Queue management with real-time updates
- Split-screen property review
- Photo gallery with keyboard navigation
- Approval/Follow-up workflow

### Backend Services (Phase 2)

- RESTful API with FastAPI
- WebSocket for real-time updates
- Celery for async tasks (notifications, image processing)
- SMS/WhatsApp notifications

## Archived Planning Documents

Legacy planning documents are archived in `./archive/`:

- `execution-plan.md` - Original execution plan
- `BUILD-PLAN.md` - Build plan and phases
- `user-journey.md` - User journey documentation
- `ui.md` - UI design documentation
- `ux.md` - UX design documentation
- `overall-design-principles.md` - Design principles
