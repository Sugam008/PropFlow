# Quick Reference

This is a quick reference guide for common commands, patterns, and information needed during PropFlow development.

## Essential Commands

### Development

```bash
# Start all services
./scripts/dev-start.sh

# Start infrastructure only
docker-compose up -d db redis minio minio-init

# Backend
cd backend && uvicorn app.main:app --reload --port 8000

# Frontend (Web)
pnpm --filter @propflow/valuer-dashboard dev
pnpm --filter @propflow/customer-portal dev
```

### Quality Checks

```bash
# All checks
pnpm lint && pnpm type-check && pnpm test

# Backend only
cd backend && ruff check . && mypy . && pytest

# Frontend only
pnpm --filter @propflow/valuer-dashboard lint
pnpm --filter @propflow/valuer-dashboard test
```

### Docker

```bash
docker-compose up -d              # Start all
docker-compose down               # Stop all
docker-compose ps                 # Status
docker-compose logs -f api        # Follow logs
docker-compose restart api        # Restart service
```

---

## API Endpoints

### Authentication

| Method | Endpoint                  | Description           |
| ------ | ------------------------- | --------------------- |
| POST   | `/api/v1/auth/login/otp`  | Request OTP           |
| POST   | `/api/v1/auth/verify-otp` | Verify OTP, get token |
| POST   | `/api/v1/auth/refresh`    | Refresh token         |
| POST   | `/api/v1/auth/logout`     | Logout                |

### Properties

| Method | Endpoint                         | Description       |
| ------ | -------------------------------- | ----------------- |
| GET    | `/api/v1/properties/`            | List properties   |
| POST   | `/api/v1/properties/`            | Create property   |
| GET    | `/api/v1/properties/{id}`        | Get property      |
| PUT    | `/api/v1/properties/{id}`        | Update property   |
| DELETE | `/api/v1/properties/{id}`        | Delete property   |
| POST   | `/api/v1/properties/{id}/submit` | Submit for review |
| POST   | `/api/v1/properties/{id}/photos` | Upload photo      |
| GET    | `/api/v1/properties/{id}/photos` | List photos       |

### Other

| Method | Endpoint         | Description  |
| ------ | ---------------- | ------------ |
| GET    | `/health`        | Health check |
| GET    | `/api/v1/status` | API status   |
| WS     | `/ws/{token}`    | WebSocket    |

---

## Environment Variables

### Backend (.env)

```bash
PROJECT_NAME=PropFlow
SECRET_KEY=<generate>
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/propflow
REDIS_HOST=localhost
REDIS_PORT=6379
S3_BUCKET=propflow-uploads
S3_ENDPOINT_URL=http://localhost:9000
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
```

### Frontend (.env)

```bash
# Valuer Dashboard
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

---

## Ports

| Service          | Port |
| ---------------- | ---- |
| Backend API      | 8000 |
| Valuer Dashboard | 3000 |
| PostgreSQL       | 5432 |
| Redis            | 6379 |
| MinIO API        | 9000 |
| MinIO Console    | 9001 |

---

## User Roles & Permissions

| Role     | Access                                     |
| -------- | ------------------------------------------ |
| CUSTOMER | Own properties only                        |
| VALUER   | All properties (review), create valuations |
| ADMIN    | Full access                                |

---

## Property Status Flow

```
DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → VALUED
                       ↓
                   FOLLOW_UP_REQUIRED → SUBMITTED
                       ↓
                    REJECTED
```

---

## Photo Types

| Type     | Required | Description        |
| -------- | -------- | ------------------ |
| FRONT    | ✓        | Front exterior     |
| SIDE     |          | Side view          |
| INTERNAL | ✓        | Interior photos    |
| DOCUMENT |          | Property documents |

---

## Design Tokens

### Colors

```typescript
colors.brand; // #E31E24 (ABC Red)
colors.brandLight; // #FF4D52
colors.brandDark; // #B3181C
colors.success; // #10B981
colors.warning; // #F59E0B
colors.error; // #EF4444
```

### Spacing

```typescript
spacing.xs; // 4px
spacing.sm; // 8px
spacing.md; // 16px
spacing.lg; // 24px
spacing.xl; // 32px
```

### Typography

```typescript
typography.fontSizes.xs; // 12px
typography.fontSizes.sm; // 14px
typography.fontSizes.base; // 16px
typography.fontSizes.lg; // 18px
typography.fontSizes.xl; // 20px
typography.fontSizes['2xl']; // 24px
```

---

## Common Patterns

### Backend: Create Endpoint

```python
@router.post("/", response_model=SchemaOut)
def create_item(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    item_in: SchemaCreate,
):
    return crud.item.create(db, obj_in=item_in)
```

### Backend: Protected Endpoint

```python
@router.get("/admin-only")
def admin_endpoint(
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    return {"message": "Admin access"}
```

### Frontend: API Query

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['properties', id],
  queryFn: () => propertiesApi.get(id),
});
```

### Frontend: Mutation

```typescript
const mutation = useMutation({
  mutationFn: propertiesApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['properties'] });
    toast.success('Created!');
  },
  onError: (error) => toast.error(error.message),
});
```

### Frontend: Zustand Store

```typescript
const useStore = create<State>((set) => ({
  value: null,
  setValue: (value) => set({ value }),
  reset: () => set({ value: null }),
}));

// Usage
const { value, setValue } = useStore();
```

---

## File Locations

| Purpose           | Location                               |
| ----------------- | -------------------------------------- |
| Backend entry     | `backend/app/main.py`                  |
| API routes        | `backend/app/api/v1/endpoints/`        |
| Database models   | `backend/app/models/`                  |
| Schemas           | `backend/app/schemas/`                 |
| Services          | `backend/app/services/`                |
| Tests             | `backend/app/tests/`                   |
| Web app pages     | `frontend/apps/valuer-dashboard/app/`  |
| Customer pages    | `frontend/apps/customer-portal/app/`   |
| Shared components | `frontend/packages/ui/src/components/` |
| Design tokens     | `frontend/packages/theme/src/index.ts` |
| Shared types      | `frontend/packages/types/src/index.ts` |
| Docker config     | `docker-compose.yml`                   |
| CI/CD             | `.github/workflows/`                   |
| Terraform         | `infrastructure/main.tf`               |

---

## Database Commands

```bash
# Migrations
alembic revision --autogenerate -m "description"
alembic upgrade head
alembic downgrade -1
alembic current

# Direct access
docker-compose exec db psql -U postgres -d propflow
```

---

## Testing Commands

```bash
# Backend
pytest                    # Run all
pytest -v                 # Verbose
pytest --cov=app          # With coverage
pytest file.py::test_name # Specific test

# Frontend
pnpm test                 # Unit tests
pnpm test:watch           # Watch mode
pnpm test:e2e             # E2E tests
```

---

## Health Check URLs

| URL                          | Purpose           |
| ---------------------------- | ----------------- |
| http://localhost:8000/health | Backend health    |
| http://localhost:8000/docs   | API documentation |
| http://localhost:3000        | Valuer Dashboard  |
| http://localhost:9001        | MinIO Console     |

---

## KPI Targets

| Metric          | Target  |
| --------------- | ------- |
| API p95 latency | < 500ms |
| Page load time  | < 2s    |
| Valuation SLA   | 5 hours |
| Completion time | < 8 min |
| Test coverage   | 80%+    |

---

## Troubleshooting Quick Fixes

| Issue               | Solution                                            |
| ------------------- | --------------------------------------------------- |
| Port in use         | `kill -9 $(lsof -t -i:PORT)`                        |
| Docker issues       | `docker-compose down -v && docker-compose up -d`    |
| Module not found    | `pnpm install` or `pip install -r requirements.txt` |
| DB connection error | Check Docker: `docker-compose ps`                   |
| Auth error          | Get new token via OTP login                         |
| CORS error          | Check CORS settings in `main.py`                    |
| Test failures       | Clear cache: `pytest --cache-clear`                 |

---

## Git Shortcuts

```bash
git checkout main && git pull
git checkout -b feature/TICKET-description
git add . && git commit -m "type: message"
git push origin HEAD
gh pr create
```

---

## Support Resources

| Resource      | Location                   |
| ------------- | -------------------------- |
| Documentation | `docs/` directory          |
| Runbooks      | `docs/ops/runbook.md`      |
| API Docs      | http://localhost:8000/docs |
| Architecture  | `docs/architecture/`       |
| Product Specs | `docs/product/`            |
