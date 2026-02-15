# PropFlow End-to-End Walkthrough

This document is the practical walkthrough for running and validating the current PropFlow implementation.

## 1) What PropFlow Is

PropFlow is a self-valuation workflow for Loan Against Property:

- Customer captures property details and photos in the mobile app.
- Backend validates, stores, and processes submissions.
- Valuer dashboard is initialized as a Phase 5 shell for review workflows.

## 2) Current Build Status (High Level)

- Backend core: implemented and passing lint/type/tests.
- Customer mobile app: core auth + submission flow integrated with backend APIs.
- Valuer dashboard: scaffold/shell in place for upcoming feature implementation.
- CI: backend + frontend checks wired.

## 3) Prerequisites

- Node.js >= 18
- pnpm >= 8
- Python 3.11
- Docker Desktop (for PostgreSQL/Redis/MinIO)

## 4) One-Time Setup

```bash
pnpm install
./scripts/dev-start.sh
```

## 5) Start Services

### Backend API

```bash
uvicorn app.main:app --reload --port 8000
```

Run from: `backend/`

### Valuer Dashboard (Web)

```bash
pnpm --filter @propflow/valuer-dashboard dev
```

Runs on: `http://localhost:3000`

### Customer App (Expo)

```bash
pnpm --filter @propflow/customer-app dev
```

For emulator/device API access, set:

- `EXPO_PUBLIC_API_BASE_URL` (optional override)
- Defaults:
  - Android emulator: `http://10.0.2.2:8000/api/v1`
  - iOS simulator: `http://localhost:8000/api/v1`

## 6) Quick Validation Checklist

### Repo Quality

```bash
pnpm lint
pnpm type-check
```

### Backend Quality

```bash
cd backend
ruff check .
mypy .
pytest -q
```

## 7) Customer User Journey Walkthrough

1. Open app at Welcome screen.
2. Enter phone number with country code (example: `+919876543210`).
3. Tap **GET STARTED** (requests OTP from backend).
4. Enter OTP on Verify screen (supports resend and validation states).
5. Complete property type, details, location, and photo capture flow.
6. Review summary and submit.
7. Submit performs real backend sequence:
   - create property
   - upload photos
   - submit property for review
8. Status screen confirms submission.

## 8) Key Runtime Endpoints

- `GET /health`
- `GET /api/v1/status`
- `POST /api/v1/auth/login/otp`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/properties/`
- `POST /api/v1/properties/{id}/photos`
- `POST /api/v1/properties/{id}/submit`

## 9) Fraud/Quality Controls Implemented

- Upload content-type validation for image uploads.
- Screenshot filename rejection at upload validation.
- Photo processing checks for:
  - missing EXIF timestamp
  - stale timestamp (>30 min)
  - missing device model metadata
  - missing GPS metadata
  - GPS mismatch (>0.5km from property location)

## 10) Known Non-Blocking Notes

- Notification provider integrations are currently dev stubs (SMS/WhatsApp service wiring pending external provider setup).
- Valuer dashboard business workflow pages are pending future phase implementation.
