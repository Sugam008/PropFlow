# PropFlow

PropFlow is an AI-powered Property Valuation and Workflow Automation platform designed for modern real estate operations.

## Project Structure

This is a monorepo managed with `pnpm` workspaces and `turborepo`.

- `backend/`: FastAPI Python application.
- `frontend/apps/customer-app/`: React Native (Expo) mobile application for customers.
- `frontend/apps/valuer-dashboard/`: Next.js web application for valuers and administrators.
- `docs/`: Architecture decisions, product requirements, and API documentation.
- `scripts/`: Utility scripts for development and infrastructure.

## Tech Stack

- **Backend**: Python 3.11, FastAPI, PostgreSQL, Redis, MinIO.
- **Frontend**: React Native (Expo), Next.js 14, Tailwind CSS.
- **Infrastructure**: Docker Compose, GitHub Actions.
- **Tooling**: PNPM, Turborepo, ESLint, Prettier, Ruff, Mypy.

## Getting Started

### Prerequisites

- Node.js >= 18
- PNPM >= 8
- Docker & Docker Compose
- Python 3.11

### Local Development (Manual)

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start Infrastructure**:
   ```bash
   docker-compose up -d db redis minio minio-init
   ```

3. **Start backend API**:
   ```bash
   cd backend && uvicorn app.main:app --reload --port 8000
   ```

4. **Start valuer dashboard**:
   ```bash
   pnpm --filter @propflow/valuer-dashboard dev
   ```

### Docker Deployment (Full Stack)

You can run the entire stack (API, Workers, Web Dashboard) using Docker:

```bash
docker-compose up --build
```

- **Valuer Dashboard**: http://localhost:3000
- **API**: http://localhost:8000
- **MinIO Console**: http://localhost:9001

## Monitoring & Health

- **Backend Health**: `GET http://localhost:8000/health` (Checks DB & Redis)
- **Frontend Health**: `GET http://localhost:3000/api/health`
- **Structured Logs**: Backend logs are output in JSON format for production observability.

## Documentation

- [Project Walkthrough](docs/WALKTHROUGH.md)
- [Documentation Index](docs/README.md)
- [Architecture Docs](docs/architecture/)
- [Product Docs](docs/product/)
- [API Reference](docs/architecture/api-design.md)
- [OpenAPI Spec](docs/api/openapi.yaml)

## License

MIT
