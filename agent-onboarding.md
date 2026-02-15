# PropFlow Agent Onboarding Guide

This document provides AI agents with comprehensive context about the PropFlow application to enable effective assistance with development, debugging, and feature implementation.

## Project Overview

**PropFlow** is an AI-powered Property Valuation and Workflow Automation platform for Loan Against Property (LAP) workflows. It enables customers to self-capture property details and photos from mobile devices, eliminating physical valuer visits while maintaining bank-grade fraud prevention.

### Core Value Proposition

- **Traditional Process**: 9 steps, 5-12 days, physical valuer visit
- **PropFlow Process**: 5 steps, 5-hour SLA, fully remote

### Brand Context

- Parent brand: Aditya Birla Capital
- Brand essence: "Money Simplified" → "Property Valuation Simplified"
- Core values: Integrity, Commitment, Passion, Seamlessness, Speed

---

## Repository Structure

```
PropFlow/
├── backend/                    # FastAPI Python application
│   ├── app/
│   │   ├── api/v1/endpoints/   # API route handlers
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # Business logic services
│   │   ├── crud/               # Database CRUD operations
│   │   ├── tasks/              # Celery background tasks
│   │   ├── core/               # Config, security, logging
│   │   ├── websocket/          # WebSocket handlers
│   │   └── tests/              # Pytest test suite
│   ├── alembic/                # Database migrations
│   └── requirements.txt
├── frontend/
│   ├── apps/
│   │   ├── valuer-dashboard/   # Next.js 14 web app
│   │   └── customer-app/       # React Native (Expo) mobile app
│   └── packages/               # Shared packages
│       ├── theme/              # Design tokens
│       ├── types/              # Shared TypeScript types
│       ├── ui/                 # Shared UI components
│       └── utils/              # Shared utilities
├── docs/                       # Documentation
│   ├── architecture/           # ADRs, domain model
│   ├── product/                # Backlog, acceptance criteria
│   ├── ops/                    # Runbooks, deployment
│   ├── Human Onboarding/       # Human onboarding guides
│   └── api/openapi.yaml        # OpenAPI specification
├── infrastructure/             # Terraform IaC
├── scripts/                    # Utility scripts
└── .github/workflows/          # CI/CD pipelines
```

---

## Technology Stack

### Backend

| Component    | Technology             |
| ------------ | ---------------------- |
| Framework    | FastAPI (Python 3.11)  |
| Database     | PostgreSQL 16          |
| ORM          | SQLAlchemy 2.0         |
| Migrations   | Alembic                |
| Cache/Broker | Redis 7                |
| Task Queue   | Celery                 |
| Storage      | MinIO (S3-compatible)  |
| Auth         | JWT (python-jose)      |
| Testing      | Pytest, pytest-asyncio |

### Frontend - Valuer Dashboard

| Component     | Technology                           |
| ------------- | ------------------------------------ |
| Framework     | Next.js 14 (App Router)              |
| React         | React 18                             |
| Styling       | Custom design tokens (inline styles) |
| State         | Zustand                              |
| Data Fetching | TanStack Query                       |
| Maps          | Leaflet, react-leaflet               |
| Animations    | Framer Motion                        |
| Testing       | Vitest, Playwright                   |

### Frontend - Customer App

| Component     | Technology          |
| ------------- | ------------------- |
| Framework     | Expo (React Native) |
| Navigation    | React Navigation    |
| State         | Zustand             |
| Data Fetching | TanStack Query      |
| Camera        | expo-camera         |
| Location      | expo-location       |

### Infrastructure

| Component        | Technology                      |
| ---------------- | ------------------------------- |
| Monorepo         | pnpm workspaces + Turborepo     |
| Containerization | Docker Compose                  |
| CI/CD            | GitHub Actions                  |
| IaC              | Terraform                       |
| Cloud            | AWS (ECS, RDS, ElastiCache, S3) |

---

## Core Domain Model

### Entities

```
User (1) ----< (N) Property (1) ----< (N) PropertyPhoto
    |                  |
    |                  +----< (1) Valuation
    |                           |
    |                           +----< (N) Comparable
    |
    +----< (N) AuditLog
```

### Key Enums

**User Roles**: `CUSTOMER`, `VALUER`, `ADMIN`

**Property Types**: `APARTMENT`, `HOUSE`, `VILLA`, `COMMERCIAL`, `LAND`

**Property Status**: `DRAFT` → `SUBMITTED` → `UNDER_REVIEW` → `APPROVED` / `REJECTED` / `FOLLOW_UP` → `VALUED`

**Photo Types**: `FRONT`, `SIDE`, `INTERNAL`, `DOCUMENT`

---

## API Endpoints Summary

### Authentication (`/api/v1/auth`)

- `POST /login/otp` - Request OTP
- `POST /verify-otp` - Verify OTP, get token
- `POST /refresh` - Refresh token
- `POST /logout` - Logout

### Properties (`/api/v1/properties`)

- `GET /` - List properties (role-filtered)
- `POST /` - Create property
- `GET /{id}` - Get property
- `PUT /{id}` - Update property
- `DELETE /{id}` - Delete property
- `POST /{id}/submit` - Submit for review
- `POST /{id}/photos` - Upload photo
- `GET /{id}/photos` - List photos

### Valuations (`/api/v1/valuations`)

- `GET /` - List valuations
- `POST /` - Create valuation
- `GET /{id}` - Get valuation

### Analytics (`/api/v1/analytics`)

- `GET /dashboard` - KPI metrics
- `GET /funnel` - Funnel analysis

### WebSocket

- `WS /ws/{token}` - Real-time updates

---

## Key Business Rules

| Rule                      | Enforcement                   |
| ------------------------- | ----------------------------- |
| Min photos required       | FRONT + INTERNAL mandatory    |
| GPS distance limit        | ≤ 0.5km from property address |
| Photo timestamp staleness | ≤ 30 minutes from capture     |
| Valuation amount          | Must be > 0 for approval      |
| Rejection reason          | Required for all rejections   |
| SLA for valuation         | 5 hours target turnaround     |
| Draft editing             | Locked after submission       |

---

## Fraud Prevention Controls

1. **Camera-Only Capture**: No gallery picker, native camera only
2. **GPS Validation**: Must be within 0.5km of property address
3. **EXIF Metadata Verification**: Timestamp < 30 min, device model required
4. **Screenshot Detection**: Rejects screenshot filenames
5. **Photo Quality Checks**: Blur, brightness, glare detection

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Start infrastructure (Docker)
docker-compose up -d db redis minio minio-init

# Start backend
cd backend && uvicorn app.main:app --reload --port 8000

# Start valuer dashboard
pnpm --filter @propflow/valuer-dashboard dev

# Start customer app
pnpm --filter @propflow/customer-app dev

# Run all checks
pnpm lint && pnpm type-check && pnpm test

# Backend tests
cd backend && pytest -q

# Frontend tests
pnpm --filter @propflow/valuer-dashboard test
pnpm --filter @propflow/valuer-dashboard test:e2e
```

---

## Code Conventions

### TypeScript/React

- Use functional components with hooks
- Zustand for client state, TanStack Query for server state
- Inline styles with design tokens from `@propflow/theme`
- File naming: `ComponentName.tsx`, `useHookName.ts`

### Python/FastAPI

- Pydantic schemas for validation
- SQLAlchemy 2.0 style ORM
- Dependency injection via `Depends()`
- Async endpoints for I/O operations

### Testing

- Frontend: Vitest + Testing Library, Playwright for E2E
- Backend: Pytest with async support
- Coverage thresholds: 80% for both

---

## Key Files to Know

| Purpose                 | File                                          |
| ----------------------- | --------------------------------------------- |
| Backend entry           | `backend/app/main.py`                         |
| API routes              | `backend/app/api/v1/api.py`                   |
| Database config         | `backend/app/database.py`                     |
| Auth dependencies       | `backend/app/api/deps.py`                     |
| Frontend entry (web)    | `frontend/apps/valuer-dashboard/app/page.tsx` |
| Frontend entry (mobile) | `frontend/apps/customer-app/App.tsx`          |
| Theme tokens            | `frontend/packages/theme/src/index.ts`        |
| Shared types            | `frontend/packages/types/src/index.ts`        |
| Docker config           | `docker-compose.yml`                          |
| CI/CD                   | `.github/workflows/ci.yml`, `deploy.yml`      |

---

## Documentation Index

| Category         | Location                 | Purpose                                     |
| ---------------- | ------------------------ | ------------------------------------------- |
| Human Onboarding | `docs/Human Onboarding/` | Comprehensive guides for new developers     |
| Architecture     | `docs/architecture/`     | ADRs, domain model, API design              |
| Product          | `docs/product/`          | Backlog, acceptance criteria, state machine |
| Ops              | `docs/ops/`              | Runbooks, deployment, monitoring            |
| Security         | `docs/security/`         | Security hardening guide                    |
| Testing          | `docs/testing/`          | Integration tests, device matrix            |

---

## Common Tasks

### Adding a new API endpoint

1. Create/update Pydantic schema in `backend/app/schemas/`
2. Add route handler in `backend/app/api/v1/endpoints/`
3. Add CRUD operation if needed in `backend/app/crud/`
4. Add tests in `backend/app/tests/`
5. Update OpenAPI spec in `docs/api/openapi.yaml`

### Adding a new UI component

1. Check if component exists in `frontend/packages/ui/`
2. Create component in appropriate app or shared package
3. Import design tokens from `@propflow/theme`
4. Add tests with Vitest
5. Update TypeScript types in `@propflow/types` if needed

### Adding a background task

1. Create task in `backend/app/tasks/`
2. Register in `backend/app/celery_app.py`
3. Add tests in `backend/app/tests/test_tasks.py`

### Database migration

1. Make model changes in `backend/app/models/`
2. Generate migration: `alembic revision --autogenerate -m "description"`
3. Review and edit migration file
4. Apply: `alembic upgrade head`

---

## Troubleshooting Quick Reference

| Issue                     | Solution                                           |
| ------------------------- | -------------------------------------------------- |
| Database connection error | Check Docker containers: `docker-compose ps`       |
| Redis connection error    | Verify Redis running: `docker-compose up -d redis` |
| Import errors             | Run `pnpm install` in root                         |
| Type errors               | Run `pnpm type-check`                              |
| Test failures             | Check test output, verify services running         |
| CORS errors               | Check CORS settings in `backend/app/main.py`       |
| WebSocket disconnects     | Verify Redis connectivity, check token validity    |

---

## When Working on PropFlow

1. **Always run tests** after making changes
2. **Follow existing patterns** in the codebase
3. **Check shared packages** before creating new components
4. **Use design tokens** for consistent styling
5. **Update documentation** for significant changes
6. **Add appropriate tests** for new functionality
7. **Follow the state machine** for property status transitions

---

For detailed human onboarding, see `docs/Human Onboarding/` directory.
