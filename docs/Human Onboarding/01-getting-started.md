# Getting Started with PropFlow

Welcome to PropFlow! This guide will help you set up your development environment and understand the project basics.

## What is PropFlow?

PropFlow is an AI-powered Property Valuation and Workflow Automation platform designed for Loan Against Property (LAP) workflows. It enables customers to self-capture property details and photos from their mobile devices, eliminating the need for physical valuer visits while maintaining bank-grade fraud prevention.

### The Problem We Solve

**Traditional Property Valuation Process:**

- 9 separate steps
- 5-12 days turnaround
- Requires physical valuer visit
- High operational cost
- Customer inconvenience

**PropFlow Process:**

- 5 streamlined steps
- 5-hour SLA target
- Fully remote from phone
- Reduced operational cost
- Customer-friendly experience

### Brand Context

- **Parent Brand**: Aditya Birla Capital
- **Brand Essence**: "Money Simplified" → "Property Valuation Simplified"
- **Core Values**: Integrity, Commitment, Passion, Seamlessness, Speed
- **Brand Color**: ABC Red (#E31E24)

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool           | Version | Purpose                        |
| -------------- | ------- | ------------------------------ |
| Node.js        | ≥ 18    | JavaScript runtime             |
| pnpm           | ≥ 8     | Package manager (monorepo)     |
| Python         | 3.11    | Backend runtime                |
| Docker Desktop | Latest  | Container runtime for services |
| Git            | Latest  | Version control                |

### Platform-Specific Notes

**macOS:**

```bash
# Install via Homebrew
brew install node pnpm python@3.11 git
```

**Windows:**

- Install Node.js from nodejs.org
- Install Python from python.org
- Install Docker Desktop from docker.com
- Install pnpm: `npm install -g pnpm`

**Linux:**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs python3.11 docker.io
npm install -g pnpm
```

---

## One-Time Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd PropFlow
pnpm install
```

### 2. Start Infrastructure Services

PropFlow requires PostgreSQL, Redis, and MinIO (S3-compatible storage):

```bash
# Start all infrastructure services
docker-compose up -d db redis minio minio-init

# Verify services are running
docker-compose ps
```

Expected output:

```
NAME                    STATUS    PORTS
propflow-db-1           running   0.0.0.0:5432->5432/tcp
propflow-redis-1        running   0.0.0.0:6379->6379/tcp
propflow-minio-1        running   0.0.0.0:9000->9000/tcp, 0.0.0.0:9001->9001/tcp
```

### 3. Initialize the Database

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head
```

### 4. Verify Setup

Run the automated setup script:

```bash
./scripts/dev-start.sh
```

This script:

1. Checks Docker availability
2. Starts infrastructure services
3. Waits for database readiness
4. Creates environment files if missing
5. Runs Alembic migrations
6. Seeds initial data (if configured)

---

## Starting the Application

### Backend API

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

The API will be available at:

- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs (Swagger UI)
- **Health**: http://localhost:8000/health

### Valuer Dashboard (Web)

```bash
pnpm --filter @propflow/valuer-dashboard dev
```

Opens at http://localhost:3000

### Customer App (Mobile)

```bash
pnpm --filter @propflow/customer-app dev
```

This starts the Expo development server. You can:

- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan QR code with Expo Go app on physical device

**Note**: For mobile app to connect to local backend:

- Android emulator: `http://10.0.2.2:8000/api/v1`
- iOS simulator: `http://localhost:8000/api/v1`
- Physical device: Use your machine's IP address

---

## Project Structure Overview

```
PropFlow/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes and endpoints
│   │   ├── models/         # Database models (SQLAlchemy)
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── crud/           # Database operations
│   │   ├── tasks/          # Celery background tasks
│   │   ├── core/           # Config, security
│   │   └── tests/          # Test suite
│   ├── alembic/            # Database migrations
│   └── requirements.txt    # Python dependencies
│
├── frontend/
│   ├── apps/
│   │   ├── valuer-dashboard/   # Next.js web app
│   │   └── customer-app/       # React Native mobile app
│   └── packages/
│       ├── theme/          # Design tokens
│       ├── types/          # Shared TypeScript types
│       ├── ui/             # Shared UI components
│       └── utils/          # Shared utilities
│
├── docs/                   # Documentation
├── infrastructure/         # Terraform IaC
├── scripts/               # Utility scripts
└── .github/workflows/     # CI/CD pipelines
```

---

## First Validation

### Run Quality Checks

```bash
# Lint all code
pnpm lint

# Type check all code
pnpm type-check

# Run all tests
pnpm test
```

### Backend-Specific Checks

```bash
cd backend

# Python linting
ruff check .

# Type checking
mypy .

# Run tests with coverage
pytest -q
```

### Frontend-Specific Checks

```bash
# Valuer Dashboard
pnpm --filter @propflow/valuer-dashboard lint
pnpm --filter @propflow/valuer-dashboard test

# Customer App
pnpm --filter @propflow/customer-app lint
```

---

## Quick API Test

### Health Check

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected"
}
```

### Request OTP

```bash
curl -X POST http://localhost:8000/api/v1/auth/login/otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+919876543210"}'
```

---

## Understanding the Monorepo

PropFlow uses **pnpm workspaces** with **Turborepo** for monorepo management.

### Key Commands

```bash
# Install all dependencies
pnpm install

# Run script in specific workspace
pnpm --filter <package-name> <script>

# Run script across all packages
pnpm <script>

# Turbo-specific commands
turbo run build
turbo run test
turbo run lint
```

### Package Naming

| Package          | Name                         | Location                          |
| ---------------- | ---------------------------- | --------------------------------- |
| Valuer Dashboard | `@propflow/valuer-dashboard` | `frontend/apps/valuer-dashboard/` |
| Customer App     | `@propflow/customer-app`     | `frontend/apps/customer-app/`     |
| Theme            | `@propflow/theme`            | `frontend/packages/theme/`        |
| Types            | `@propflow/types`            | `frontend/packages/types/`        |
| UI               | `@propflow/ui`               | `frontend/packages/ui/`           |
| Utils            | `@propflow/utils`            | `frontend/packages/utils/`        |

---

## Common Issues & Solutions

| Issue                           | Solution                                           |
| ------------------------------- | -------------------------------------------------- |
| `pnpm: command not found`       | Install pnpm: `npm install -g pnpm`                |
| Docker containers not starting  | Ensure Docker Desktop is running                   |
| Database connection error       | Check containers: `docker-compose ps`              |
| Python module not found         | Activate venv: `source backend/venv/bin/activate`  |
| Port already in use             | Kill process: `lsof -i :8000` then `kill -9 <PID>` |
| Mobile app can't connect to API | Check API_BASE_URL in .env                         |

---

## Known Limitations

- **Notification providers** (SMS/WhatsApp) are development stubs - wiring pending external provider setup
- **Valuer dashboard** business workflow pages are pending future implementation

---

## Next Steps

1. Read [02-architecture-deep-dive.md](./02-architecture-deep-dive.md) to understand the system architecture
2. Read [03-backend-guide.md](./03-backend-guide.md) for backend development details
3. Read [04-frontend-guide.md](./04-frontend-guide.md) for frontend development details
4. Review [07-business-domain.md](./07-business-domain.md) to understand the business context

---

## Getting Help

- **Documentation**: Check the `docs/` directory
- **Runbooks**: See `docs/ops/runbook.md` for operational issues
- **API Docs**: Visit http://localhost:8000/docs when backend is running
- **Architecture Decisions**: See `docs/architecture/adr-*.md` files
