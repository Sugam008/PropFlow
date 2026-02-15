# PropFlow: Master Execution Plan
## Complete End-to-End Build Blueprint
### Aditya Birla Capital — Self-Valuation Application for LAP

---

| Attribute | Detail |
|-----------|--------|
| **Version** | 2.0 |
| **Created** | February 14, 2026 |
| **Source Docs** | BUILD-PLAN.md, final-research.md, idea.md, user-journey.md, ui.md, ux.md, overall-design-principles.md |

### Structure: Phase → Stage → Step → Sub-step

### Success Criteria

| Metric | Target |
|--------|--------|
| Customer completion time | < 8 minutes |
| Valuation turnaround | < 5 hours |
| Screens per session | 4-5 average |
| App size | < 25MB |
| Load time on 3G | < 3 seconds |
| Crash rate | < 0.1% |
| FCP / LCP | < 1.5s / < 2.5s |
| API p95 latency | < 500ms |
| Test coverage | > 80% |
| WCAG | 2.1 AA |

---

## Non-Negotiable Product Requirements

These must never regress at any phase:

1. **Fraud Prevention Baseline**
   - Camera-only capture (no gallery upload)
   - GPS capture and validation (Haversine ≤ 0.5km)
   - EXIF metadata verification (timestamp, device model)
   - Screenshot detection and rejection

2. **Customer Speed & Simplicity**
   - 4-step core flow for submission
   - < 8 minute customer completion target
   - Real-time status updates and transparent ETA

3. **Valuer Efficiency**
   - Queue + split-screen review surface
   - One-click actions: Approve / Reject / Follow-up
   - Keyboard shortcuts for rapid throughput

4. **Trust & Quality**
   - "Why we ask this" explanations at every permission request
   - Full submission and status traceability
   - Accurate comparable-property context for valuers

5. **Accessibility & Low-Device Support**
   - WCAG 2.1 AA compliance
   - 44×44px minimum touch targets
   - Android 7+ / iOS 13+ support
   - Must function on 2GB RAM devices and 3G networks

---

## Delivery Model

Two parallel tracks sharing the same user journey and quality principles:

| Track | Purpose | Scope | Duration |
|-------|---------|-------|----------|
| **Track A: Stakeholder Demo** | Fast proof-of-concept to validate flow | Constrained MVP using no-code tools (Glide/Retool) or lightweight code | 48 hours |
| **Track B: Production Build** | Full engineered stack with security, quality, observability | Complete end-to-end build per this plan | 6-8 weeks |

---

## Macro Roadmap (Phases + Gates)

| Phase | Name | Duration | Exit Gate |
|-------|------|----------|-----------|
| P0 | Program Setup + Scope Lock | 2-3 days | G0: Scope/Architecture Freeze |
| P1 | Engineering Foundation | 1-2 days | G1: Environments + CI Green |
| P2 | Backend Core | 4-5 days | G2: Auth/Property/Photo APIs Stable |
| P3 | Shared Frontend Packages | 2-3 days | G3: UI/UX Baseline Approved |
| P4 | Customer Mobile App | 7-10 days | G4: S1-S11 End-to-End Works |
| P5 | Valuer Dashboard | 5-7 days | G5: Queue-to-Decision Flow Works |
| P6 | Integration & Real-time | 2-3 days | G6: Live Status + Notifications Verified |
| P7 | Testing & Quality Hardening | 3-4 days | G7: Test/Perf/A11y/Security Pass |
| P8 | Polish & Deployment | 3-4 days | G8: Production Go-Live |
| P9 | Post-Launch Stabilization | 2-4 weeks | G9: KPI Stability Achieved |

**Rule: No phase may begin unless previous gate is marked passed.** If a gate fails, create a correction sprint and re-run the gate criteria.

---

# PHASE 0: PROGRAM SETUP + SCOPE LOCK (2-3 days)
**Goal**: Requirements frozen, architecture decided, domain model locked, governance in place.

## Stage 0.1: Product Requirements Decomposition

### Step 0.1.1: Build Source-of-Truth Backlog
| | |
|---|---|
| **Dependencies** | All source documents available |
| **Estimated Time** | 4 hours |
| **Verification** | Backlog reviewed and approved |

- **0.1.1.1**: Parse all source docs into Epics → Features → Stories → Tasks
- **0.1.1.2**: Tag every backlog item as MVP / Pilot / Future
- **0.1.1.3**: Add acceptance criteria for each story
- **0.1.1.4**: Create epic groups: Customer App Flow, Valuer Workflow, Fraud Prevention, Notifications, Comps + Valuation, Analytics
- **0.1.1.5**: De-duplicate contradictory requirements across docs
- **0.1.1.6**: Mark all hard constraints as "must-pass" checks
- **Deliverables**: `docs/product/backlog-master.md`, `docs/product/acceptance-criteria.md`

### Step 0.1.2: Screen & State Inventory
| | |
|---|---|
| **Dependencies** | Step 0.1.1 |
| **Estimated Time** | 3 hours |
| **Verification** | All screens and states documented |

- **0.1.2.1**: Freeze screen list (S1-S11 customer, V1-V5 valuer) per user-journey.md
- **0.1.2.2**: Freeze all status transitions: DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED / REJECTED / FOLLOW_UP_REQUIRED
- **0.1.2.3**: Define mandatory empty/loading/error/success states per screen per ux.md
- **Deliverables**: `docs/product/screen-inventory.md`, `docs/product/state-machine.md`

## Stage 0.2: Architecture & Stack Decisions

### Step 0.2.1: Resolve Architecture
| | |
|---|---|
| **Dependencies** | Stage 0.1 |
| **Estimated Time** | 3 hours |
| **Verification** | ADRs signed off |

- **0.2.1.1**: Confirm canonical production stack: FastAPI + PostgreSQL + React Native (Expo) + Next.js 14
- **0.2.1.2**: Keep no-code 48-hour demo as Track A only
- **0.2.1.3**: Freeze infra assumptions: S3 (object storage), Redis (cache/queue), WebSocket (real-time), Celery (background tasks)
- **Deliverables**: `docs/architecture/adr-001-stack-decision.md`, `docs/architecture/adr-002-demo-vs-production-track.md`

### Step 0.2.2: Domain Model Freeze
| | |
|---|---|
| **Dependencies** | Step 0.2.1 |
| **Estimated Time** | 3 hours |
| **Verification** | Domain model document reviewed |

- **0.2.2.1**: Freeze entities: User, Property, PropertyPhoto, Valuation, Comparable, AuditLog
- **0.2.2.2**: Freeze enums and status lifecycle per BUILD-PLAN.md §4
- **0.2.2.3**: Define ownership and referential integrity rules
- **Deliverables**: `docs/architecture/domain-model.md`, `docs/architecture/status-lifecycle.md`

## Stage 0.3: Governance & Execution Control

### Step 0.3.1: Define Cadence & Controls
| | |
|---|---|
| **Dependencies** | Stage 0.2 |
| **Estimated Time** | 2 hours |
| **Verification** | Process docs committed |

- **0.3.1.1**: Define cadence: daily standup, weekly demo, weekly risk review
- **0.3.1.2**: Define merge policy: no merge without tests + lint + review
- **0.3.1.3**: Define severity matrix: P0 (ship-blocker), P1 (release-blocker), P2 (should-fix), P3 (nice-to-have)
- **0.3.1.4**: Define commit message conventions (conventional commits)
- **Deliverables**: `docs/process/engineering-rules.md`, `docs/process/risk-register.md`

### ✅ Gate G0 (must pass)
- [ ] Scope freeze signed off
- [ ] Architecture freeze signed off
- [ ] MVP / Pilot / Future boundaries documented
- [ ] Backlog has testable acceptance criteria
- [ ] Domain model and status lifecycle documented

---

# PHASE 1: ENGINEERING FOUNDATION (1-2 days)
**Goal**: Repository initialized, dev environment running, CI green, team can start coding.

## Stage 1.1: Repository & Scaffolding

### Step 1.1.1: Monorepo Structure
| | |
|---|---|
| **Dependencies** | Gate G0 passed |
| **Estimated Time** | 2 hours |
| **Verification** | `npm run build` completes, `uvicorn` starts |

- **1.1.1.1**: Git init + `.gitignore` (node_modules, .env, dist, __pycache__, venv)
- **1.1.1.2**: Directory scaffold per BUILD-PLAN.md §3: `backend/`, `frontend/apps/customer-app/`, `frontend/apps/valuer-dashboard/`, `frontend/packages/{ui,types,utils}/`, `infrastructure/`, `docs/`
- **1.1.1.3**: Frontend Turborepo — `package.json` workspaces, `turbo.json` pipeline, `tsconfig.base.json`
- **1.1.1.4**: Python backend — `requirements.txt` (fastapi, sqlalchemy, alembic, pydantic, python-jose, passlib, pillow, piexif, boto3, celery, redis, websockets, pytest, ruff), `pyproject.toml`, `.env.example`

### Step 1.1.2: Dev Tooling
| | |
|---|---|
| **Dependencies** | Step 1.1.1 |
| **Estimated Time** | 3 hours |
| **Verification** | Pre-commit hooks fire on commit |

- **1.1.2.1**: ESLint + Prettier for frontend
- **1.1.2.2**: Ruff + mypy for Python
- **1.1.2.3**: Husky + lint-staged pre-commit hooks
- **1.1.2.4**: VS Code settings + recommended extensions

## Stage 1.2: Infrastructure

### Step 1.2.1: Docker Compose
| | |
|---|---|
| **Dependencies** | Step 1.1.1 |
| **Estimated Time** | 4 hours |
| **Verification** | `docker-compose up -d` starts all services |

- **1.2.1.1**: `docker-compose.yml` — postgres:16 (5432), redis:7 (6379), minio (9000/9001), healthchecks, persistent volumes
- **1.2.1.2**: DB init script — creates `propflow` database
- **1.2.1.3**: MinIO init — creates `propflow-uploads` bucket + CORS

### Step 1.2.2: Environment
| | |
|---|---|
| **Dependencies** | Step 1.2.1 |
| **Estimated Time** | 2 hours |
| **Verification** | `scripts/dev-start.sh` runs cleanly on fresh clone |

- **1.2.2.1**: Backend `.env.example` — all vars from BUILD-PLAN.md §7 (DATABASE_URL, REDIS_URL, JWT_SECRET, AWS creds, Google Cloud, Twilio, WhatsApp)
- **1.2.2.2**: Frontend `.env.example` — API_URL, WS_URL, MAPBOX_TOKEN for both apps
- **1.2.2.3**: Environment segregation: local / staging / production
- **1.2.2.4**: `scripts/dev-start.sh` — Docker up, wait health, migrate, seed

## Stage 1.3: CI/CD Baseline

### Step 1.3.1: CI Pipeline
| | |
|---|---|
| **Dependencies** | Stage 1.2 |
| **Estimated Time** | 3 hours |
| **Verification** | CI green on default branch |

- **1.3.1.1**: GitHub Actions: lint + type-check + unit tests on PR
- **1.3.1.2**: Block merge if any check fails
- **1.3.1.3**: Verify backend image build, dashboard build, mobile bundle size tracking

## Stage 1.4: Documentation
| | |
|---|---|
| **Dependencies** | Stage 1.2 |
| **Estimated Time** | 2 hours |
| **Verification** | Fresh machine setup succeeds via docs |

- **1.4.1.1**: `docs/setup/local-setup.md` — Prerequisites + step-by-step for all OS
- **1.4.1.2**: `docs/architecture/system-overview.md` — Architecture diagram from BUILD-PLAN.md
- **1.4.1.3**: `docs/architecture/api-design.md` — All endpoints from BUILD-PLAN.md §5
- **1.4.1.4**: Root `README.md` — Overview, quick start, links

### ✅ Gate G1 (must pass)
- [ ] Fresh machine setup succeeds via docs
- [ ] CI is green on default branch
- [ ] Seeded environment launches with zero manual hacks
- [ ] Docker services healthy

---

# PHASE 2: BACKEND CORE (4-5 days)
**Goal**: Fully functional FastAPI backend with auth, models, CRUD, services, WebSocket, background tasks, audit logging.

## Stage 2.1: Database Layer

### Step 2.1.1: SQLAlchemy Models
| | |
|---|---|
| **Dependencies** | Gate G1 passed |
| **Estimated Time** | 6 hours |
| **Verification** | All models import without errors |

- **2.1.1.1**: `app/database.py` — Engine, SessionLocal, Base, get_db()
- **2.1.1.2**: `app/core/config.py` — Pydantic BaseSettings for all env vars
- **2.1.1.3**: `app/models/user.py` — User: id(UUID), phone(unique/indexed), email, name, role(CUSTOMER/VALUER/ADMIN), hashed_password, timestamps. Role enum.
- **2.1.1.4**: `app/models/property.py` — Property: id, user_id(FK), property_type, address, city, state, pincode, lat/lng, area_sqft, bedrooms, bathrooms, floor, total_floors, age, description, status, submitted_at, reviewed_at, estimated_value, valuer_notes, valuer_id, timestamps. PropertyStatus enum (DRAFT→SUBMITTED→UNDER_REVIEW→APPROVED/REJECTED/FOLLOW_UP). PropertyType enum.
- **2.1.1.5**: `app/models/photo.py` — PropertyPhoto: id, property_id(FK), s3_key, s3_url, photo_type, sequence, captured_at, gps_lat/lng, device_model, qc_status, qc_notes, created_at
- **2.1.1.6**: `app/models/valuation.py` — Valuation: id, property_id(FK), valuer_id(FK), market_value, forced_sale_value, lumsum_value, comp1/2/3_id, notes, timestamps
- **2.1.1.7**: `app/models/comp.py` — Comparable: id, address, city, property_type, area_sqft, bedrooms, bathrooms, price, price_per_sqft, transaction_date, distance_km, source, timestamps
- **2.1.1.8**: `app/models/audit_log.py` — AuditLog: id, entity_type, entity_id, action, old_value(JSON), new_value(JSON), actor_id(FK), timestamp. Immutable event trail for compliance.
- **2.1.1.9**: `app/models/__init__.py` — barrel export

### Step 2.1.2: Migrations
| | |
|---|---|
| **Dependencies** | Step 2.1.1 |
| **Estimated Time** | 3 hours |
| **Verification** | `alembic upgrade head` succeeds, all tables verified |

- **2.1.2.1**: Init Alembic, configure env.py with rollback support
- **2.1.2.2**: Generate initial migration `--autogenerate`
- **2.1.2.3**: Apply + verify all tables/indexes/FKs/constraints

### Step 2.1.3: Seed Data
| | |
|---|---|
| **Dependencies** | Step 2.1.2 |
| **Estimated Time** | 2 hours |
| **Verification** | Seed script completes, data verified in DB |

- **2.1.3.1**: `scripts/seed.py` — 3 users (customer/valuer/admin), 3 properties (different statuses), 6 photos each, 5 comps, 1 valuation. Realistic Bengaluru data.

## Stage 2.2: Authentication

### Step 2.2.1: Security Utilities
| | |
|---|---|
| **Dependencies** | Step 2.1.2 |
| **Estimated Time** | 4 hours |
| **Verification** | Unit tests pass for JWT, hashing, OTP |

- **2.2.1.1**: `app/core/security.py` — JWT create/verify (python-jose HS256), password hash/verify (bcrypt)
- **2.2.1.2**: `app/services/otp_service.py` — generate 6-digit OTP, store Redis (5min TTL), verify, rate limit (3/10min/phone)

### Step 2.2.2: Session Management
| | |
|---|---|
| **Dependencies** | Step 2.2.1 |
| **Estimated Time** | 3 hours |
| **Verification** | Sessions persist, validate, and expire correctly |

- **2.2.2.1**: Configure Redis connection and client
- **2.2.2.2**: Implement session storage in Redis
- **2.2.2.3**: Implement session validation and cleanup of expired sessions

### Step 2.2.3: Auth API
| | |
|---|---|
| **Dependencies** | Step 2.2.2 |
| **Estimated Time** | 6 hours |
| **Verification** | All auth endpoints return correct responses |

- **2.2.3.1**: `app/schemas/auth.py` — PhoneLoginRequest, OTPVerifyRequest, TokenResponse, RefreshRequest
- **2.2.3.2**: `app/api/v1/auth/auth.py` — POST /login (send OTP), POST /verify-otp (verify → create user if new → tokens), POST /refresh, POST /logout
- **2.2.3.3**: `app/api/deps.py` — get_current_user, require_role dependencies
- **2.2.3.4**: `app/core/exceptions.py` — Custom exceptions (InvalidOTP, ExpiredOTP, RateLimit, Unauthorized, Forbidden, NotFound) + global handlers

### Step 2.2.4: Auth Tests
| | |
|---|---|
| **Dependencies** | Step 2.2.3 |
| **Estimated Time** | 4 hours |
| **Verification** | All auth tests pass |

- **2.2.4.1**: Unit: JWT, hashing, OTP generation
- **2.2.4.2**: Integration: full login→OTP→verify→refresh→logout flow + error cases (invalid OTP, expired, rate limit)

## Stage 2.3: CRUD Operations

### Step 2.3.1: Base
| | |
|---|---|
| **Dependencies** | Stage 2.2 |
| **Estimated Time** | 2 hours |
| **Verification** | Generic CRUD works for any model |

- **2.3.1.1**: `app/crud/base.py` — Generic CRUDBase with get, get_multi, create, update, remove

### Step 2.3.2: Property
| | |
|---|---|
| **Dependencies** | Step 2.3.1 |
| **Estimated Time** | 8 hours |
| **Verification** | All CRUD operations + submission flow tested |

- **2.3.2.1**: `app/schemas/property.py` — Create, Update, Response, ListResponse, Submit schemas
- **2.3.2.2**: `app/crud/property.py` — get_by_user, get_pending_review, submit (DRAFT→SUBMITTED), assign_valuer, update_status with validation
- **2.3.2.3**: `app/api/v1/properties/properties.py` — GET list, GET detail, POST create, PUT update, DELETE draft, POST submit. Role-based filtering.

### Step 2.3.3: Photos
| | |
|---|---|
| **Dependencies** | Step 2.3.2 |
| **Estimated Time** | 6 hours |
| **Verification** | Photos upload with EXIF correctly extracted |

- **2.3.3.1**: `app/schemas/photo.py` — Upload, Response, QCUpdate schemas
- **2.3.3.2**: `app/crud/photo.py` — create_with_exif, get_by_property, update_qc, delete
- **2.3.3.3**: `app/api/v1/properties/photos.py` — GET list, POST upload (multipart + EXIF check), DELETE. Enforce required photo categories before submission.

### Step 2.3.4: Valuations & Comps
| | |
|---|---|
| **Dependencies** | Step 2.3.2 |
| **Estimated Time** | 8 hours |
| **Verification** | All valuation actions update property status correctly |

- **2.3.4.1**: `app/schemas/valuation.py` — Create, Response, Approve, Reject, FollowUp schemas
- **2.3.4.2**: `app/crud/valuation.py` — create, approve, reject, request_follow_up with status transition logic
- **2.3.4.3**: `app/api/v1/valuations/` — GET list, GET detail, POST create, POST approve/reject/follow-up (valuer only)
- **2.3.4.4**: `app/api/v1/comps/` — GET list, GET search (Haversine distance), POST add (valuer/admin only)

## Stage 2.4: Core Services

### Step 2.4.1: Image Processing
| | |
|---|---|
| **Dependencies** | Step 2.3.3 |
| **Estimated Time** | 6 hours |
| **Verification** | EXIF extraction + GPS validation pass on test images |

- **2.4.1.1**: `app/services/image_service.py` — extract_exif, get_gps_coordinates, get_timestamp, get_device (per BUILD-PLAN.md §6.1)
- **2.4.1.2**: GPS validation — validate_gps_match (Haversine, 0.5km), validate_timestamp (30min), detect_screenshot (missing camera EXIF)
- **2.4.1.3**: `app/services/storage_service.py` — upload_image (compress 1920px/85%, S3), generate_thumbnail (for dashboard gallery), delete, presigned_url

### Step 2.4.2: Image QC
| | |
|---|---|
| **Dependencies** | Step 2.4.1 |
| **Estimated Time** | 6 hours |
| **Verification** | QC runs and returns correct scores on test images |

- **2.4.2.1**: `app/services/image_qc_service.py` — check_blur (Laplacian <30), check_brightness (<40), check_glare (>70%), run_qc_checks. User-friendly messages per user-journey.md.
- **2.4.2.2**: `app/services/vision_service.py` — Google Vision (labels, safe search). Async Celery task. Fallback: skip gracefully if API unavailable.

### Step 2.4.3: Notifications
| | |
|---|---|
| **Dependencies** | Stage 2.3 |
| **Estimated Time** | 6 hours |
| **Verification** | Notifications fire on status changes (dev: console, prod: actual) |

- **2.4.3.1**: `app/services/sms_service.py` — send_sms (dev:console, prod:Twilio). send_otp, send_status_update.
- **2.4.3.2**: `app/services/whatsapp_service.py` — send_whatsapp (dev:console, prod:WA API). Templates: submission_received, review_started, valuation_complete, follow_up_required.
- **2.4.3.3**: `app/services/notification_service.py` — orchestrator: notify_submission (SMS immediate + WA delayed), notify_review, notify_complete (all channels), notify_followup. Retry + fallback policy.

## Stage 2.5: Audit & Observability

### Step 2.5.1: Audit Logging
| | |
|---|---|
| **Dependencies** | Stage 2.3 |
| **Estimated Time** | 4 hours |
| **Verification** | All status changes produce immutable audit records |

- **2.5.1.1**: `app/services/audit_service.py` — log_event(entity_type, entity_id, action, old_value, new_value, actor_id). Immutable event trail.
- **2.5.1.2**: Integrate audit logging into all property status transitions (submit, assign, approve, reject, follow-up)
- **2.5.1.3**: Integrate audit logging into valuation creation and updates

### Step 2.5.2: Structured Logging & Metrics
| | |
|---|---|
| **Dependencies** | Step 2.5.1 |
| **Estimated Time** | 3 hours |
| **Verification** | Logs contain trace IDs, metrics endpoint responds |

- **2.5.2.1**: Configure structured JSON logging with trace IDs for request correlation
- **2.5.2.2**: Add API latency and error rate metrics collection
- **2.5.2.3**: Expose /metrics endpoint for monitoring

## Stage 2.6: WebSocket & Real-time
| | |
|---|---|
| **Dependencies** | Stage 2.3 |
| **Estimated Time** | 6 hours |
| **Verification** | Real-time updates received on WebSocket client |

- **2.6.1.1**: `app/websocket/connection.py` — ConnectionManager per BUILD-PLAN.md §6.2 (connect, disconnect, send_personal, broadcast_to_room)
- **2.6.1.2**: `app/api/v1/websocket.py` — /ws endpoint with JWT auth, rooms: property:{id}, valuers
- **2.6.1.3**: Events: property:new (submit→valuers), property:updated (status→customer), valuation:created
- **2.6.1.4**: Connection lifecycle: auth validation, heartbeat, reconnection support

## Stage 2.7: Background Tasks
| | |
|---|---|
| **Dependencies** | Stage 2.4, Stage 2.5 |
| **Estimated Time** | 5 hours |
| **Verification** | Tasks execute in background, results persisted |

- **2.7.1.1**: `app/celery_app.py` — Celery + Redis config, task autodiscovery
- **2.7.1.2**: `app/tasks/image_processing.py` — process_photo: download, EXIF, QC, GPS, timestamp, update record, WebSocket notify on failure
- **2.7.1.3**: `app/tasks/notifications.py` — async notification tasks with retry
- **2.7.1.4**: `app/tasks/cleanup.py` — periodic task for expired session cleanup, orphaned upload cleanup

## Stage 2.8: Assembly & Integration Test
| | |
|---|---|
| **Dependencies** | All Stage 2.x |
| **Estimated Time** | 4 hours |
| **Verification** | Health check green, full flow test passes |

- **2.8.1.1**: `app/main.py` — FastAPI init, CORS, routers, WebSocket, startup/shutdown events, exception handlers, /docs
- **2.8.1.2**: Health check — GET /health (DB + Redis + S3), GET /api/v1/status
- **2.8.1.3**: Integration test — full flow: login→property→photos→submit→review→approve. Verify WebSocket events + notifications + audit trail.

### ✅ Gate G2 (must pass)
- [ ] Auth flow works end-to-end (login → OTP → verify → refresh → logout)
- [ ] Property and photo APIs pass integration tests
- [ ] Audit trail visible for all lifecycle events
- [ ] WebSocket events fire correctly on status changes
- [ ] CI pipeline passes for backend

---

# PHASE 3: SHARED FRONTEND PACKAGES (2-3 days)
**Goal**: Design system, shared types, and utilities built as reusable packages for both apps.

## Stage 3.1: Types Package
| | |
|---|---|
| **Dependencies** | Gate G2 passed (backend API contracts stable) |
| **Estimated Time** | 4 hours |
| **Verification** | Types compile, match backend schemas |

- **3.1.1.1**: Init `packages/types/` with package.json + tsconfig
- **3.1.1.2**: `user.types.ts` — User, Role, AuthTokens, LoginRequest, OTPVerifyRequest
- **3.1.1.3**: `property.types.ts` — Property, PropertyType, PropertyStatus, CRUD schemas
- **3.1.1.4**: `photo.types.ts` — PropertyPhoto, PhotoType, QCStatus
- **3.1.1.5**: `valuation.types.ts` — Valuation, Comparable, Approve/Reject/FollowUp
- **3.1.1.6**: `api.types.ts` — ApiResponse<T>, ApiError, PaginatedResponse<T>, WebSocketEvent
- **3.1.1.7**: `index.ts` barrel

## Stage 3.2: UI Package (Design System)

### Step 3.2.1: Theme Tokens
| | |
|---|---|
| **Dependencies** | Stage 3.1 |
| **Estimated Time** | 6 hours |
| **Verification** | Token parity verified across apps, brand red contrast-safe |

- **3.2.1.1**: Init `packages/ui/` with package.json + tsconfig
- **3.2.1.2**: `theme/colors.ts` — Primary (#E31E24/#B81B20/#8B0000), Neutral (11 shades), Semantic (success/warning/error/info/purple + light variants) per ui.md
- **3.2.1.3**: `theme/typography.ts` — Inter + Noto Sans, 15 tokens (display-1→code), responsive sizes per ui.md
- **3.2.1.4**: `theme/spacing.ts` — 4px base, space-0→space-24
- **3.2.1.5**: `theme/shadows.ts` — xs→2xl + brand shadow per ui.md
- **3.2.1.6**: `theme/radius.ts` — none→full (0→9999)
- **3.2.1.7**: `theme/animations.ts` — cubic-bezier functions, duration scale (0→600ms)
- **3.2.1.8**: `theme/gradients.ts` — Primary, Subtle, Warm, Sunrise per ui.md
- **3.2.1.9**: `theme/index.ts` — unified export

### Step 3.2.2: Core Component Library
| | |
|---|---|
| **Dependencies** | Step 3.2.1 |
| **Estimated Time** | 8 hours |
| **Verification** | Components render with correct styling, accessibility contracts pass |

- **3.2.2.1**: Button (primary/secondary/ghost; loading/disabled states)
- **3.2.2.2**: Input (default/focus/error/success states)
- **3.2.2.3**: Card (interactive/selectable)
- **3.2.2.4**: OTP Input (6-digit, auto-focus, paste)
- **3.2.2.5**: Progress indicators (linear/circular)
- **3.2.2.6**: Status badges (pending/review/approved/follow-up/rejected)
- **3.2.2.7**: Modal, Toast, Skeleton loader
- **3.2.2.8**: Visual regression snapshots for critical components

### Step 3.2.3: Accessibility Contracts
| | |
|---|---|
| **Dependencies** | Step 3.2.2 |
| **Estimated Time** | 3 hours |
| **Verification** | ARIA labels, focus order, reduced motion verified |

- **3.2.3.1**: Keyboard focus states on all interactive elements
- **3.2.3.2**: ARIA labels and screen-reader order
- **3.2.3.3**: Reduced motion behavior (prefers-reduced-motion)
- **3.2.3.4**: Touch target enforcement (≥ 44×44px)

## Stage 3.3: Utils Package
| | |
|---|---|
| **Dependencies** | Stage 3.1 |
| **Estimated Time** | 3 hours |
| **Verification** | All utility functions unit tested |

- **3.3.1.1**: Init `packages/utils/`
- **3.3.1.2**: `currency.ts` — formatINR (₹72,00,000 Indian system), formatLakhs, formatPricePerSqFt
- **3.3.1.3**: `date.ts` — formatRelative, formatDateTime, formatETA, formatDuration
- **3.3.1.4**: `validation.ts` — isValidIndianPhone, isValidPincode, isValidOTP, isValidArea
- **3.3.1.5**: `index.ts` barrel

## Stage 3.4: UX State Contract Pack
| | |
|---|---|
| **Dependencies** | Stage 3.2 |
| **Estimated Time** | 3 hours |
| **Verification** | State contracts complete for all MVP screens |

- **3.4.1.1**: Define success/loading/error/empty states for every screen per ux.md
- **3.4.1.2**: Define copy tone for trust and clarity per overall-design-principles.md
- **3.4.1.3**: Define microinteraction timings per ui.md animation specs
- **Deliverables**: `docs/design/component-contracts.md`, `docs/design/state-contracts.md`

### ✅ Gate G3 (must pass)
- [ ] Design token parity verified across apps
- [ ] Component library passes accessibility baseline
- [ ] UX state contracts complete for all MVP screens
- [ ] Visual regression snapshots captured

---

# PHASE 4: CUSTOMER MOBILE APP (7-10 days)
**Goal**: Complete customer journey S1-S11 end-to-end.

## Stage 4.1: App Shell

### Step 4.1.1: Expo Setup
| | |
|---|---|
| **Dependencies** | Gate G3 passed |
| **Estimated Time** | 4 hours |
| **Verification** | Expo project runs on simulator |

- **4.1.1.1**: Init Expo in `apps/customer-app/`. app.json: "PropFlow", iOS 13+, Android 7+, portrait, ABC icon/splash.
- **4.1.1.2**: Install: @react-navigation, zustand, react-hook-form, zod, axios, @tanstack/react-query, react-native-maps, expo-camera, expo-location, expo-secure-store, react-native-reanimated, expo-haptics
- **4.1.1.3**: Theme provider wrapping @propflow/ui tokens

### Step 4.1.2: Navigation
| | |
|---|---|
| **Dependencies** | Step 4.1.1 |
| **Estimated Time** | 4 hours |
| **Verification** | All navigation flows work, deep linking works |

- **4.1.2.1**: Type-safe param lists (Auth, Main stacks)
- **4.1.2.2**: AuthNavigator: Welcome → OTP
- **4.1.2.3**: MainNavigator: PropertyType → Details → Location → Photos → Review → Submit. Bottom tabs post-submit: Home, Status. Progress header "Step X of 4".
- **4.1.2.4**: RootNavigator: auth-conditional + deep linking

### Step 4.1.3: API & State
| | |
|---|---|
| **Dependencies** | Step 4.1.2 |
| **Estimated Time** | 5 hours |
| **Verification** | Auth flow works, state persists across app restart |

- **4.1.3.1**: Axios client — JWT interceptor, refresh, error handling
- **4.1.3.2**: Auth service — requestOTP, verifyOTP, refresh, logout
- **4.1.3.3**: Auth store (Zustand) — user, tokens, persist to SecureStore
- **4.1.3.4**: Property store (Zustand) — form state, photos, auto-save every 30s per ux.md
- **4.1.3.5**: UI store (Zustand) — loading states, modal visibility, toast queue
- **4.1.3.6**: WebSocket service — auth connect, property room, events, reconnect backoff

## Stage 4.2: Common Components
| | |
|---|---|
| **Dependencies** | Step 4.1.1 |
| **Estimated Time** | 6 hours |
| **Verification** | All components render correctly with correct styling |

- **4.2.1.1**: **Button** — Primary/Secondary/Ghost, press scale(0.98)+haptic, disabled, loading. 48px height.
- **4.2.1.2**: **Input** — Label/hint/error/success states per ui.md. 52px height, 16px font.
- **4.2.1.3**: **Card** — Standard/Interactive/Selectable (red border+checkmark).
- **4.2.1.4**: **Header** — Back, step indicator, help. Animated progress bar.
- **4.2.1.5**: **Loading** — Skeleton shimmer, spinner, progress bar per ux.md.
- **4.2.1.6**: **Toast** — Success/warning/error/info, auto-dismiss 3s.

## Stage 4.3: Auth Screens

### Step 4.3.1: Welcome (S1 per user-journey.md)
| | |
|---|---|
| **Dependencies** | Stage 4.2 |
| **Estimated Time** | 4 hours |
| **Verification** | Screen matches design specs, animations at 60fps |

- **4.3.1.1**: ABC Logo fade-in (600ms), tagline slide-up (400ms), value prop, trust badges, CTA "GET STARTED", "Track Here →"
- **4.3.1.2**: react-native-reanimated animations at 60fps
- **4.3.1.3**: CTA → haptic + navigate OTP. Error: retry button.

### Step 4.3.2: OTP (S2)
| | |
|---|---|
| **Dependencies** | Step 4.3.1 |
| **Estimated Time** | 5 hours |
| **Verification** | OTP flow completes successfully, error states work |

- **4.3.2.1**: Phone input (+91), SEND OTP, 6 OTP boxes (48×56px), countdown, VERIFY →
- **4.3.2.2**: Auto-focus next box, paste, Android SMS auto-read, green fill animation
- **4.3.2.3**: Validation, countdown, verify flow. Errors: shake (invalid), auto-resend (expired), support (too many)

## Stage 4.4: Property Screens

### Step 4.4.1: Property Type (S3)
| | |
|---|---|
| **Dependencies** | Stage 4.3 |
| **Estimated Time** | 3 hours |
| **Verification** | Selection works and auto-advances |

- **4.4.1.1**: "Step 1/4" + 25%, 4 selectable cards: Apartment, House, Plot, Commercial (120px)
- **4.4.1.2**: Tap: scale(1.02) → checkmark → red border → 400ms auto-advance

### Step 4.4.2: Property Details (S4)
| | |
|---|---|
| **Dependencies** | Step 4.4.1 |
| **Estimated Time** | 6 hours |
| **Verification** | All form fields work with validation, smart defaults apply |

- **4.4.2.1**: "Step 2/4" + 50%, BHK pills (default 2BHK), area input+slider (500-5000), age dropdown, floor dropdown (conditional)
- **4.4.2.2**: Smart defaults: area range by BHK, slider tooltip, contextual help, >3000 commercial hint, >20yr info
- **4.4.2.3**: react-hook-form + Zod, keyboard avoidance, auto-save

### Step 4.4.3: Location (S5)
| | |
|---|---|
| **Dependencies** | Step 4.4.2 |
| **Estimated Time** | 6 hours |
| **Verification** | GPS captures correctly with reverse-geocoded address |

- **4.4.3.1**: "Step 3/4" + 75%, map with pin, "📍 Location detected", address card (editable), warning, "CAPTURE LOCATION →"
- **4.4.3.2**: Permission dialog with trust explanation per user-journey.md, auto-detect, accuracy indicator, reverse geocode
- **4.4.3.3**: Errors: GPS disabled → Settings link, weak signal → animated indicator, mismatch → edit

### Step 4.4.4: Photo Capture (S6)
| | |
|---|---|
| **Dependencies** | Step 4.4.3 |
| **Estimated Time** | 10 hours |
| **Verification** | Camera captures with guidance, QC feedback appears, uploads succeed |

- **4.4.4.1**: "Step 4/4" + 100%, 2×3 grid of 6 photo slots (Exterior, Living, Kitchen, Bedroom, Bathroom, Society)
- **4.4.4.2**: **GuidedCamera** — expo-camera, NO gallery (camera-only per idea.md), room overlay guide, text instruction, flash, capture button. EXIF auto-capture.
- **4.4.4.3**: Photo guides config per BUILD-PLAN.md §6.3: FRONT ("full building+entrance"), LIVING ("corner, include window"), KITCHEN ("counter, appliances"), BEDROOM ("wardrobe"), BATHROOM ("fittings, ventilation"), SOCIETY ("club, parking, lift")
- **4.4.4.4**: Real-time QC — blur(<30), brightness(<40), glare(>70%) per user-journey.md. Soft: USE ANYWAY. Hard: must retake.
- **4.4.4.5**: Optional audio guidance via expo-speech per user-journey.md
- **4.4.4.6**: Upload with progress, background upload while capturing next

### Step 4.4.5: Photo Review (S7)
| | |
|---|---|
| **Dependencies** | Step 4.4.4 |
| **Estimated Time** | 4 hours |
| **Verification** | Review and retake work correctly |

- **4.4.5.1**: Grid with ✓/⚠️ badges, retake per photo, problems first, "SUBMIT ALL PHOTOS →"
- **4.4.5.2**: Tap → full-size. Retake → camera. Can submit with soft warnings.

### Step 4.4.6: Submit Confirmation (S8)
| | |
|---|---|
| **Dependencies** | Step 4.4.5 |
| **Estimated Time** | 4 hours |
| **Verification** | Success screen shows with correct data, notifications fire |

- **4.4.6.1**: ✅ animation + confetti, reference number (copyable), "What happens next?" (3 steps), status timeline, ETA, "SHARE VIA WHATSAPP"
- **4.4.6.2**: API submit, WebSocket subscribe, navigate to tracking

### Step 4.4.7: Status Tracking (S9)
| | |
|---|---|
| **Dependencies** | Step 4.4.6 |
| **Estimated Time** | 6 hours |
| **Verification** | Status updates in real-time via WebSocket |

- **4.4.7.1**: Reference, time ago, real-time timeline (✓ Submitted → ● In Review + valuer name → ○ Complete + ETA), photo thumbs, support
- **4.4.7.2**: WebSocket live updates, pull-to-refresh fallback

### Step 4.4.8: Valuation Result (S10) & Follow-up (S11)
| | |
|---|---|
| **Dependencies** | Step 4.4.7 |
| **Estimated Time** | 5 hours |
| **Verification** | Results display correctly, follow-up retake works |

- **4.4.8.1**: 🎉 animation, "₹72-78 Lakhs", comps explanation, "DOWNLOAD REPORT", "CONTINUE LOAN"
- **4.4.8.2**: Follow-up screen (S11): ⚠️ ACTION NEEDED, issues list, retake for flagged photos

## Stage 4.5: Resilience
| | |
|---|---|
| **Dependencies** | Stage 4.4 |
| **Estimated Time** | 4 hours |
| **Verification** | Resume-after-interruption flow validated |

- **4.5.1.1**: Auto-save to AsyncStorage every 30s + before background. Recovery dialog: "We found your saved progress. [Continue from Step 3] [Start Over]" per ux.md.
- **4.5.1.2**: Network error: "Connection lost. Progress saved." + retry per user-journey.md
- **4.5.1.3**: Permission denied: explanations + Settings link + manual fallbacks

### ✅ Gate G4 (must pass)
- [ ] First-time user can complete S1-S8 in ≤ 8 min median on test cohort
- [ ] Drop-off instrumentation active for every step
- [ ] Resume-after-interruption flow validated
- [ ] No gallery bypass route exists (camera-only enforced)
- [ ] All error/empty/loading states implemented per ux.md

---

# PHASE 5: VALUER DASHBOARD — Next.js 14 (5-7 days)
**Goal**: Complete valuer experience V1-V5 — Queue → Review → Approve/Reject/Follow-up → Completion.

## Stage 5.1: Dashboard Shell

### Step 5.1.1: Next.js Setup
| | |
|---|---|
| **Dependencies** | Gate G3 passed (can run parallel with Phase 4) |
| **Estimated Time** | 4 hours |
| **Verification** | Next.js project runs, Tailwind renders correctly |

- **5.1.1.1**: Init Next.js 14 App Router in `apps/valuer-dashboard/`
- **5.1.1.2**: Install: tailwindcss, @tanstack/react-query, zustand, react-hook-form, zod, recharts, lucide-react, mapbox-gl, socket.io-client
- **5.1.1.3**: Tailwind config with ABC brand colors/spacing/typography from ui.md
- **5.1.1.4**: globals.css — Inter font, CSS custom properties, resets

### Step 5.1.2: Layout
| | |
|---|---|
| **Dependencies** | Step 5.1.1 |
| **Estimated Time** | 5 hours |
| **Verification** | Layout renders with correct navigation, responsive |

- **5.1.2.1**: Auth layout — centered card
- **5.1.2.2**: Dashboard layout — Fixed sidebar (200px): 📋 Queue(count), ✅ Completed, 📊 Reports, ⚙️ Settings. Top bar: logo, 🔔 notifications, user avatar. Per user-journey.md valuer nav.
- **5.1.2.3**: Responsive: Desktop fixed sidebar, tablet collapsible, mobile hamburger

### Step 5.1.3: Auth & API
| | |
|---|---|
| **Dependencies** | Step 5.1.2 |
| **Estimated Time** | 4 hours |
| **Verification** | Login works, protected routes redirect, WebSocket connects |

- **5.1.3.1**: Login page (email/password for valuers)
- **5.1.3.2**: API client + JWT interceptor
- **5.1.3.3**: Next.js middleware protecting dashboard routes
- **5.1.3.4**: WebSocket connect on load, "valuers" room

## Stage 5.2: Components
| | |
|---|---|
| **Dependencies** | Stage 5.1 |
| **Estimated Time** | 6 hours |
| **Verification** | All components render with correct styling |

- **5.2.1.1**: Button, Input, DataTable, Modal, StatusBadge (Pending/Review/Approved/Follow-up/Rejected per ui.md)
- **5.2.1.2**: PropertyCard — ref, customer, type, area, location, photos, time, priority, "START REVIEW →"
- **5.2.1.3**: PhotoGallery — thumbs, click expand, arrow nav, zoom
- **5.2.1.4**: PropertyMap — Mapbox: property pin + accuracy + comp pins

## Stage 5.3: Queue (V1 per user-journey.md)
| | |
|---|---|
| **Dependencies** | Stage 5.2 |
| **Estimated Time** | 6 hours |
| **Verification** | Queue loads, navigates, real-time updates work |

- **5.3.1.1**: Dashboard home — Greeting, stats cards (pending+urgent, completed+today), weekly chart
- **5.3.1.2**: Queue list — PropertyCards, priority 🔴(<1hr) 🟡(<3hr) ⚪(>3hr), sort/filter/search
- **5.3.1.3**: Real-time — WebSocket property:new → card appears with animation
- **5.3.1.4**: Keyboard shortcuts — J/K navigate, Enter open, 1-9 jump, ? help

## Stage 5.4: Property Review (V2)
| | |
|---|---|
| **Dependencies** | Stage 5.3 |
| **Estimated Time** | 10 hours |
| **Verification** | Split-screen works across breakpoints, photo nav works, timer tracks |

- **5.4.1.1**: Desktop split-screen per user-journey.md V2 — Left (60%): main photo + thumbstrip + nav + QC results. Right (40%): property details + map + comps.
- **5.4.1.2**: Tablet: tighter split, collapsible comps
- **5.4.1.3**: Mobile: single column, tabs, sticky actions
- **5.4.1.4**: Photo nav — click thumb, ←/→ keys, E fullscreen, zoom, auto-advance
- **5.4.1.5**: Timer "⏱️ 3:42"
- **5.4.2.1**: Comps panel — 3 nearest comps with relevance explanation, search more, show on map with distance
- **5.4.3.1**: Actions: [A] Approve, [R] Follow-up, [F] Flag. Keyboard shortcuts.

## Stage 5.5: Modals (V3, V4, V5)

### Step 5.5.1: Follow-up Modal (V3)
| | |
|---|---|
| **Dependencies** | Stage 5.4 |
| **Estimated Time** | 4 hours |
| **Verification** | Follow-up sends actionable customer instructions |

- **5.5.1.1**: Issue checklist, auto-generated message (editable), retake indicators, Send per user-journey.md V3
- **5.5.1.2**: Templated messages: dark photo → "retake with better lighting", blurry → "hold steady", etc.
- **5.5.1.3**: API → FOLLOW_UP_REQUIRED → notification → WebSocket

### Step 5.5.2: Approval Modal (V4)
| | |
|---|---|
| **Dependencies** | Stage 5.4 |
| **Estimated Time** | 5 hours |
| **Verification** | Valuation has comps, rationale, confidence metadata |

- **5.5.2.1**: Value range slider, adjustment dropdown, final value, confidence bar, notes per user-journey.md V4
- **5.5.2.2**: Persist rationale text and adjustment factors for customer explanation
- **5.5.2.3**: API → APPROVED → all notifications → WebSocket → customer result

### Step 5.5.3: Completion (V5)
| | |
|---|---|
| **Dependencies** | Step 5.5.2 |
| **Estimated Time** | 3 hours |
| **Verification** | Summary shows, next-in-queue auto-advances |

- **5.5.3.1**: ✅ summary, customer notified, audit trail/email/link actions, next-in-queue card per user-journey.md V5
- **5.5.3.2**: Auto-advance to next property in queue for seamless workflow

## Stage 5.6: Supporting Pages
| | |
|---|---|
| **Dependencies** | Stage 5.5 |
| **Estimated Time** | 6 hours |
| **Verification** | Stats display correctly, settings persist |

- **5.6.1.1**: Completed list — table with sort/search, click for read-only review + audit trail
- **5.6.2.1**: Reports — Recharts: reviews/day, approve/reject split, avg review time, export
- **5.6.3.1**: Settings — profile, notification prefs, keyboard ref, theme

### ✅ Gate G5 (must pass)
- [ ] Valuer can process a file from queue to decision in < 5 minutes avg
- [ ] Keyboard shortcuts work without regressions
- [ ] Follow-up request includes actionable customer instructions
- [ ] Every valuation has comps, rationale, and confidence metadata
- [ ] Audit trace complete for compliance

---

# PHASE 6: INTEGRATION & REAL-TIME (2-3 days)
**Goal**: Both apps connected to backend, real-time updates flowing, notifications working end-to-end.

## Stage 6.1: End-to-End Wiring
| | |
|---|---|
| **Dependencies** | Gates G2 + G4 + G5 passed |
| **Estimated Time** | 10 hours |
| **Verification** | All features work end-to-end on real APIs |

- **6.1.1.1**: Customer → Backend: wire all screens to real APIs (replace mock data)
- **6.1.1.2**: Test: OTP → create → upload → submit → confirmation
- **6.1.1.3**: Verify EXIF extraction from real camera photos
- **6.1.1.4**: Verify GPS validation + photo QC feedback
- **6.1.2.1**: Valuer → Backend: wire queue, review, actions to real endpoints
- **6.1.3.1**: Real-time test: submit → queue appears (WebSocket)
- **6.1.3.2**: Review started → customer sees "In Review" + valuer name
- **6.1.3.3**: Approve → customer sees result
- **6.1.3.4**: Follow-up → customer sees action needed
- **6.1.3.5**: WebSocket reconnection after network drop
- **6.1.4.1**: Notifications: SMS/WhatsApp at correct stages, correct content per user-journey.md
- **6.1.4.2**: Notification delivery tracking + retry on failure

## Stage 6.2: Maps Integration
| | |
|---|---|
| **Dependencies** | Stage 6.1 |
| **Estimated Time** | 4 hours |
| **Verification** | Maps render on all target devices |

- **6.2.1.1**: Customer: property pin + accuracy circle
- **6.2.1.2**: Valuer: property + comp pins with distance lines
- **6.2.1.3**: Verify map provider tokens and rendering on all devices

## Stage 6.3: Error Handling Hardening
| | |
|---|---|
| **Dependencies** | Stage 6.1 |
| **Estimated Time** | 4 hours |
| **Verification** | Errors handled gracefully across both apps |

- **6.3.1.1**: API error handling — server errors, network errors, timeout
- **6.3.1.2**: Validation error feedback — form-level and field-level
- **6.3.1.3**: Offline handling — network disconnection detection + recovery
- **6.3.1.4**: Retry logic — automatic retry for transient failures

### ✅ Gate G6 (must pass)
- [ ] Status update appears in-app and via notification within SLA
- [ ] Notification content is understandable and actionable
- [ ] End-to-end customer→valuer cycle works on real devices
- [ ] WebSocket reconnection works after network drop
- [ ] Delivery logs available for troubleshooting

---

# PHASE 7: TESTING & QUALITY HARDENING (3-4 days)
**Goal**: Comprehensive testing, accessibility compliance, performance targets met, security hardened.

## Stage 7.1: Backend Tests
| | |
|---|---|
| **Dependencies** | Gate G6 passed |
| **Estimated Time** | 12 hours |
| **Verification** | > 80% test coverage, all tests pass |

- **7.1.1.1**: Unit: CRUD, image service, QC thresholds, notifications, auth, audit logging
- **7.1.1.2**: Integration: full submission flow, full valuation flow, follow-up→retake→resubmit→approve cycle
- **7.1.1.3**: WebSocket events for all status transitions
- **7.1.1.4**: Concurrent access tests (multiple valuers, queue assignment)
- **7.1.1.5**: API: status codes, auth middleware, input validation, pagination
- **7.1.1.6**: Fraud bypass regression tests (gallery, screenshot, GPS spoof)
- **7.1.1.7**: OTP/login regression tests
- **7.1.1.8**: Set up test coverage reporting → target > 80%

## Stage 7.2: Frontend Tests
| | |
|---|---|
| **Dependencies** | Gate G6 passed |
| **Estimated Time** | 12 hours |
| **Verification** | Key flows tested, E2E passing |

- **7.2.1.1**: Component tests: render, states, interactions for all shared components
- **7.2.1.2**: Hook tests: custom hooks for API, state, WebSocket
- **7.2.1.3**: Screen tests: each screen with mock data, error/empty states
- **7.2.1.4**: E2E Playwright (dashboard): login → queue → review → approve
- **7.2.1.5**: E2E Detox (customer app, if feasible): login → submit → track
- **7.2.1.6**: Configure CI to run tests on pull requests

## Stage 7.3: Accessibility Hardening
| | |
|---|---|
| **Dependencies** | Stage 7.2 |
| **Estimated Time** | 6 hours |
| **Verification** | Lighthouse accessibility = 100 |

- **7.3.1.1**: Color contrast ≥ 4.5:1 per ui.md
- **7.3.1.2**: Touch targets ≥ 44×44px per overall-design-principles.md
- **7.3.1.3**: Focus indicators on all interactive elements
- **7.3.1.4**: Screen reader: VoiceOver + TalkBack (customer), NVDA (dashboard)
- **7.3.1.5**: Full keyboard nav for dashboard (all flows completable)
- **7.3.1.6**: prefers-reduced-motion respected
- **7.3.1.7**: Lighthouse accessibility audit → 100

## Stage 7.4: Device Matrix Validation
| | |
|---|---|
| **Dependencies** | Stage 7.3 |
| **Estimated Time** | 6 hours |
| **Verification** | All target devices pass |

- **7.4.1.1**: Budget Android (2GB RAM, Android 7)
- **7.4.1.2**: Mid-range Android (Android 12+)
- **7.4.1.3**: iPhone baseline (iPhone 8 / iOS 13)
- **7.4.1.4**: Tablet portrait/landscape
- **7.4.1.5**: Desktop browser matrix (Chrome 90+, Firefox, Safari, Edge)

## Stage 7.5: Performance Hardening
| | |
|---|---|
| **Dependencies** | Stage 7.2 |
| **Estimated Time** | 6 hours |
| **Verification** | All performance targets met |

- **7.5.1.1**: FCP < 1.5s, LCP < 2.5s, CLS < 0.1, FID < 100ms per overall-design-principles.md
- **7.5.1.2**: Lighthouse performance → > 90
- **7.5.1.3**: Bundle < 25MB
- **7.5.1.4**: 3G simulation load < 3s
- **7.5.1.5**: 6-photo upload on 4G with progress indicators
- **7.5.1.6**: Dashboard photo preloading → instant navigation feel
- **7.5.1.7**: API p95 latency < 500ms

## Stage 7.6: Security Hardening
| | |
|---|---|
| **Dependencies** | Stage 7.1 |
| **Estimated Time** | 6 hours |
| **Verification** | Security review signoff |

- **7.6.1.1**: JWT short expiry (15min) + HTTP-only refresh per BUILD-PLAN.md §11
- **7.6.1.2**: EXIF validation on all uploads, screenshot rejection
- **7.6.1.3**: Rate limiting on all endpoints (especially auth)
- **7.6.1.4**: TLS in transit + encrypted S3 at rest
- **7.6.1.5**: Input validation everywhere (Pydantic/Zod), no SQL injection
- **7.6.1.6**: CORS strict origin allowlist
- **7.6.1.7**: PII handling and deletion workflow verified
- **7.6.1.8**: Dependency audit (npm audit, pip-audit), fix critical/high

### ✅ Gate G7 (must pass)
- [ ] Critical bugs = 0; high bugs within release tolerance
- [ ] Accessibility baseline achieved (Lighthouse 100)
- [ ] Performance targets met (FCP, LCP, bundle, 3G)
- [ ] Security review signoff achieved
- [ ] All critical path E2E tests passing
- [ ] Device matrix validation complete

---

# PHASE 8: POLISH & DEPLOYMENT (3-4 days)
**Goal**: Production-ready, branded, optimized, deployed, demo-ready.

## Stage 8.1: Branding & Polish
| | |
|---|---|
| **Dependencies** | Gate G7 passed |
| **Estimated Time** | 6 hours |
| **Verification** | Brand-compliant across all touchpoints |

- **8.1.1.1**: ABC logo: welcome (animated), dashboard header, loading (sun motif per overall-design-principles.md)
- **8.1.1.2**: Splash screen + app icon (ABC branded)
- **8.1.1.3**: Favicon + meta tags (dashboard)
- **8.1.1.4**: Email templates (branded valuation reports)
- **8.1.1.5**: Verify all micro-interactions per ui.md: button 100ms, card 200ms, modal 300ms, page 400ms, success 600ms+confetti
- **8.1.1.6**: Microcopy review: all text per ux.md, errors = what+why+next, empty states, no placeholder text

## Stage 8.2: Performance Optimization
| | |
|---|---|
| **Dependencies** | Stage 8.1 |
| **Estimated Time** | 4 hours |
| **Verification** | Final Lighthouse audit passes |

- **8.2.1.1**: Image: progressive load, lazy, WebP
- **8.2.1.2**: Code splitting: dynamic imports for map/camera/charts
- **8.2.1.3**: Font: preload Inter, font-display:swap
- **8.2.1.4**: Bundle analysis, tree-shake unused deps
- **8.2.1.5**: DB: indexes, eager loading, pagination optimization
- **8.2.1.6**: Redis caching for comps + sessions

## Stage 8.3: Deployment Infrastructure
| | |
|---|---|
| **Dependencies** | Stage 8.2 |
| **Estimated Time** | 8 hours |
| **Verification** | Staging deploy succeeds, rollback works |

### Step 8.3.1: Containers
- **8.3.1.1**: Backend Dockerfile (multi-stage, Python 3.11-slim)
- **8.3.1.2**: Frontend Dockerfile (build Next.js → nginx)

### Step 8.3.2: IaC
- **8.3.2.1**: Terraform: ECS/RDS/ElastiCache/S3/ALB (backend), CloudFront+S3 or Vercel (frontend)
- **8.3.2.2**: K8s manifests: deployments, services, HPA, ingress+TLS

### Step 8.3.3: CI/CD
- **8.3.3.1**: GitHub Actions: PR→lint+test+build, main→deploy staging, tag→deploy prod
- **8.3.3.2**: Staging + production env configs
- **8.3.3.3**: DB migration in deployment pipeline
- **8.3.3.4**: Rollback drill — verify rollback procedure works

### Step 8.3.4: Mobile Build
- **8.3.4.1**: EAS Build config
- **8.3.4.2**: Android APK/AAB
- **8.3.4.3**: iOS IPA (requires Apple Developer account)
- **8.3.4.4**: QR code for demo distribution per final-research.md §9
- **8.3.4.5**: Configure DNS + SSL for custom domains

## Stage 8.4: Monitoring & Analytics
| | |
|---|---|
| **Dependencies** | Stage 8.3 |
| **Estimated Time** | 6 hours |
| **Verification** | Dashboards live, alerts firing on test events |

- **8.4.1.1**: Sentry error tracking + performance monitoring
- **8.4.1.2**: Health checks + uptime alerts
- **8.4.1.3**: Business metrics dashboard: submissions/day, review time, approval rate
- **8.4.1.4**: User analytics: event tracking, conversion funnels, drop-off by screen
- **8.4.1.5**: Monitoring dashboards (Grafana/DataDog) for API latency, error rates

## Stage 8.5: Documentation
| | |
|---|---|
| **Dependencies** | Stage 8.3 |
| **Estimated Time** | 4 hours |
| **Verification** | Docs complete and reviewed |

- **8.5.1.1**: User guide — how to use the customer app
- **8.5.1.2**: API documentation — OpenAPI/Swagger auto-generated at /docs
- **8.5.1.3**: Deployment guide — infrastructure setup
- **8.5.1.4**: Operational runbooks — incident response, rollback procedure, on-call escalation

## Stage 8.6: Operational Readiness
| | |
|---|---|
| **Dependencies** | Stage 8.4, Stage 8.5 |
| **Estimated Time** | 3 hours |
| **Verification** | Incident response tested |

- **8.6.1.1**: Runbook for incidents and rollback
- **8.6.1.2**: On-call escalation matrix
- **8.6.1.3**: Monitoring dashboards and alerts verified
- **8.6.1.4**: Data migration dry run on staging

## Stage 8.7: Demo Prep (per final-research.md §9)
| | |
|---|---|
| **Dependencies** | Stage 8.3 |
| **Estimated Time** | 3 hours |
| **Verification** | Demo completes in < 2 minutes |

- **8.7.1.1**: Prepare demo device + QR code
- **8.7.1.2**: Dashboard on projector
- **8.7.1.3**: Demo script: hand phone → submit "property" (photos of room) → appears on projector → approve → phone updates
- **8.7.1.4**: Practice run < 2 minutes
- **8.7.1.5**: Backup screenshots/video if live demo fails

## Stage 8.8: Controlled Pilot Release
| | |
|---|---|
| **Dependencies** | Stage 8.6 |
| **Estimated Time** | 4 hours |
| **Verification** | Pilot cohort live, no blocking issues |

- **8.8.1.1**: Limited user cohort rollout (internal team first)
- **8.8.1.2**: Feature flags for high-risk paths (photo QC strictness, notification channels)
- **8.8.1.3**: Real-time KPI watch room during pilot
- **8.8.1.4**: Daily triage of pilot feedback
- **8.8.1.5**: Fast patches for P0/P1 issues

### ✅ Gate G8 (must pass)
- [ ] Pilot cohort live with no blocking issues
- [ ] End-to-end customer-to-valuer cycle proven in production
- [ ] Incident response proven operational
- [ ] Monitoring dashboards active
- [ ] Demo completes successfully

---

# PHASE 9: POST-LAUNCH STABILIZATION (2-4 weeks)
**Goal**: KPIs stable, funnel optimized, future roadmap prepared.

## Stage 9.1: KPI Stabilization
| | |
|---|---|
| **Dependencies** | Gate G8 passed |
| **Estimated Time** | Ongoing (2-4 weeks) |
| **Verification** | KPI trends stable over 2-4 weeks |

- **9.1.1.1**: Monitor completion time < 8 min target progression
- **9.1.1.2**: Monitor review throughput and follow-up rate optimization
- **9.1.1.3**: Track and reduce support ticket patterns
- **9.1.1.4**: Analyze drop-off hotspots by screen
- **9.1.1.5**: Improve copy, defaults, and hints based on data
- **9.1.1.6**: Re-test and re-measure after changes

## Stage 9.2: Product Hardening
| | |
|---|---|
| **Dependencies** | Stage 9.1 |
| **Estimated Time** | Ongoing |
| **Verification** | No unresolved critical incidents |

- **9.2.1.1**: Queue resilience tuning
- **9.2.1.2**: Retry strategy tuning for notifications
- **9.2.1.3**: Data integrity reconciliation jobs

## Stage 9.3: Future Roadmap Preparation
| | |
|---|---|
| **Dependencies** | Stage 9.1 |
| **Estimated Time** | 1 week |
| **Verification** | Next roadmap phase approved with evidence |

- **9.3.1.1**: AI preliminary valuation readiness assessment
- **9.3.1.2**: OCR / voice feature preparation notes
- **9.3.1.3**: Property registry integration feasibility
- **9.3.1.4**: Dark mode implementation (per ui.md future section)
- **9.3.1.5**: Multi-language support assessment (Hindi, regional)

### ✅ Gate G9 (must pass)
- [ ] KPI trends stable over 2-4 weeks
- [ ] No unresolved critical incidents
- [ ] Next roadmap phase approved with evidence

---

# TRACK A: 48-HOUR DEMO EXECUTION (parallel, optional)

### Day 0 (Prep — 30-60 min)
- [ ] Create accounts for rapid demo tools (Glide/Retool/Make.com)
- [ ] Prepare brand assets and sample data
- [ ] Prepare demo script and success criteria

### Day 1 (Customer demo app)
- [ ] Build property form + camera + GPS flow (Glide or lightweight React Native)
- [ ] Add guided instructions and confirmation screen
- [ ] Validate mobile submission into central data store

### Day 2 (Valuer demo dashboard)
- [ ] Build queue + detail + A/R/F actions (Retool)
- [ ] Add map and mock comparables panel
- [ ] Run full demo: submit from phone → review on dashboard → status update

### Demo success criteria
- [ ] Stakeholder can submit live from device
- [ ] Submission appears instantly in review queue
- [ ] Decision update is reflected in user-facing status

---

# TIMELINE SUMMARY

| Phase | Name | Duration | Cumulative |
|-------|------|----------|------------|
| P0 | Program Setup + Scope Lock | 2-3 days | Day 1-3 |
| P1 | Engineering Foundation | 1-2 days | Day 4-5 |
| P2 | Backend Core | 4-5 days | Day 6-10 |
| P3 | Shared Frontend Packages | 2-3 days | Day 11-13 |
| P4 | Customer Mobile App | 7-10 days | Day 14-23 |
| P5 | Valuer Dashboard | 5-7 days | Day 14-23 (parallel w/ P4) |
| P6 | Integration & Real-time | 2-3 days | Day 24-26 |
| P7 | Testing & Quality Hardening | 3-4 days | Day 27-30 |
| P8 | Polish & Deployment | 3-4 days | Day 31-34 |
| P9 | Post-Launch Stabilization | 2-4 weeks | Day 35+ |

**Total to launch: ~30-34 working days (~7 weeks)**
**Total to stability: +2-4 weeks post-launch**

---

# DEPENDENCY MAP

```
P0 (Scope Lock)
  │
  P1 (Foundation)
  ├──→ P2 (Backend) ──────────────────────────────┐
  ├──→ P3 (Shared Packages) ──┐                    │
  │                            ├→ P4 (Customer App)──┐
  │                            ├→ P5 (Dashboard) ────┤
  │                                                    │
  │                        P6 (Integration) ◄─────────┘
  │                               │
  │                        P7 (Testing & QA)
  │                               │
  │                        P8 (Deploy & Pilot)
  │                               │
  │                        P9 (Stabilization)
```

**Parallel work:** P2 + P3 can start simultaneously after P1. P4 + P5 in parallel after P3. P2 must complete before P6.

---

# FIRST 15 WORKING DAYS (Daily Start Plan)

### Week 1
- **Day 1**: P0 — Backlog decomposition + scope freeze draft
- **Day 2**: P0 — Architecture ADRs + domain/status model freeze
- **Day 3**: P0 → P1 — Gate G0 signoff + repo scaffolding + local infra
- **Day 4**: P1 — CI baseline + lint/test pipelines
- **Day 5**: P2 — Schema + migrations + seed scripts

### Week 2
- **Day 6**: P2 — Auth APIs + OTP flow
- **Day 7**: P2 — Property CRUD APIs + validation
- **Day 8**: P3 — Design tokens + shared theme package
- **Day 9**: P3 — Core components (button/input/card/progress) + accessibility
- **Day 10**: P4 — Customer S1/S2/S3 screens wired to backend

### Week 3
- **Day 11**: P4 — Customer S4/S5 + smart defaults/validation
- **Day 12**: P4 — Camera module + guided overlays
- **Day 13**: P4 — Photo upload + metadata persistence
- **Day 14**: P4 — Review/submit flows + confirmation
- **Day 15**: P4 + P5 — End-to-end walkthrough + begin valuer queue

---

# KPI INSTRUMENTATION PLAN

### Customer KPIs
- Completion time (median, p90)
- Drop-off by screen (S1→S8)
- Photo retake rate
- Help/support initiation rate

### Valuer KPIs
- Reviews per hour
- Average review duration
- Follow-up ratio
- Keyboard shortcut usage rate

### System KPIs
- API p95 latency
- WebSocket event delivery time
- Notification delivery success rate
- Crash/error rate

### Business / Trust KPIs
- Perceived ease score (NPS)
- SLA adherence trend
- Valuation accuracy vs. physical valuation

---

# RISK REGISTER

| Risk | Probability | Impact | Owner | Mitigation | Trigger |
|------|------------|--------|-------|------------|---------|
| GPS inconsistency across devices | Medium | High | Mobile Lead | Tolerance + fallback manual pin | > 5% location mismatch |
| Poor photo quality at scale | High | Medium | QC Lead | Tighten guidance + threshold tuning | Retake rate > 30% |
| Notification provider instability | Medium | High | Backend Lead | Retry + fallback channels | Delivery failures spike |
| Low-end device performance | Medium | High | Frontend Lead | Profile + optimize + degrade gracefully | TTI > 5s on target device |
| API abuse / OTP spam | Medium | High | Security Lead | Rate limits + abuse rules | Abnormal OTP traffic |
| WhatsApp Business API approval delay | Medium | Medium | PM | SMS as primary fallback | Approval > 2 weeks |
| Expo native limitations | Low | Medium | Mobile Lead | Eject to bare workflow | Camera/GPS module blocked |
| Comp data accuracy | High | Medium | Product | Manual entry + mock for demo | Valuer feedback on comp quality |

---

# EXTERNAL INTEGRATION CHECKLIST

- [ ] Maps provider API key obtained + usage limits understood
- [ ] SMS provider account + templates + DLT registration (if applicable in India)
- [ ] WhatsApp Business API setup + template approval workflow started
- [ ] Google Cloud Vision API quotas understood + fallback behavior defined
- [ ] S3/MinIO lifecycle policies and retention configured
- [ ] App Store / Play Store accounts created (for distribution)

**Security reminder**: Never hardcode API keys in source. Keep secrets in environment/secret manager only.

---

# ENGINEERING QUALITY GATES (Multi-Level Definition of Done)

### Task-Level DoD
- [ ] Code complete and readable
- [ ] Unit tests added/updated
- [ ] Lint/type checks pass
- [ ] Feature documented if API-facing

### Story-Level DoD
- [ ] Acceptance criteria satisfied
- [ ] Integration tested in dev environment
- [ ] Error/empty/loading states validated
- [ ] Accessibility checks executed

### Stage-Level DoD
- [ ] All stories done
- [ ] No unresolved critical/high defects
- [ ] Demo and sign-off completed

### Phase-Level DoD
- [ ] Exit gate criteria met and passed
- [ ] KPI baseline measured
- [ ] Risks reviewed and mitigated

---

# LAUNCH READINESS CHECKLIST

### Product
- [ ] Critical customer and valuer journeys complete (S1-S11, V1-V5)
- [ ] All required screens implemented with all states
- [ ] Copy and trust messaging reviewed

### Engineering
- [ ] APIs stable and versioned
- [ ] Data model and migrations production-safe
- [ ] Real-time + notifications stable

### Security & Compliance
- [ ] RBAC and audit logs verified
- [ ] Abuse controls active
- [ ] Sensitive data handling verified
- [ ] PII deletion workflow tested

### Quality
- [ ] E2E critical suite green
- [ ] Device/browser matrix pass
- [ ] Accessibility pass for MVP scope
- [ ] Test coverage > 80%

### Operations
- [ ] Monitoring dashboards live
- [ ] Alerts and on-call rotations set
- [ ] Incident and rollback runbook tested

### Business
- [ ] KPI dashboards available
- [ ] Pilot cohort and support process ready
- [ ] Stakeholder demo script and metrics narrative prepared

---

# APPENDIX A: TECHNOLOGY STACK

## Backend
| Component | Technology |
|-----------|------------|
| Runtime | Python 3.11+ |
| Framework | FastAPI |
| Database | PostgreSQL 16 |
| ORM | SQLAlchemy 2.0 + Alembic |
| File Storage | AWS S3 / MinIO |
| Real-time | WebSocket (native FastAPI) |
| Image Processing | Pillow + piexif |
| AI/ML | Google Cloud Vision API |
| Authentication | JWT + Redis sessions |
| Task Queue | Celery + Redis |
| Notifications | Twilio (SMS) + WhatsApp Business API |

## Frontend — Customer App
| Component | Technology |
|-----------|------------|
| Framework | React Native (Expo) |
| State | Zustand |
| Data Fetching | @tanstack/react-query |
| Forms | React Hook Form + Zod |
| Maps | react-native-maps |
| Navigation | React Navigation |
| Animations | react-native-reanimated |

## Frontend — Valuer Dashboard
| Component | Technology |
|-----------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| State | Zustand + React Query |
| Charts | Recharts |
| Icons | Lucide React |
| Maps | Mapbox GL JS |

---

# APPENDIX B: API ENDPOINTS

## Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/login | Send OTP to phone |
| POST | /api/v1/auth/verify-otp | Verify OTP, return tokens |
| POST | /api/v1/auth/refresh | Refresh access token |
| POST | /api/v1/auth/logout | Invalidate session |

## Properties
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/properties | List (role-filtered) |
| GET | /api/v1/properties/:id | Detail with photos |
| POST | /api/v1/properties | Create property |
| PUT | /api/v1/properties/:id | Update draft |
| DELETE | /api/v1/properties/:id | Delete draft |
| POST | /api/v1/properties/:id/submit | Submit for review |
| GET | /api/v1/properties/:id/photos | List photos |
| POST | /api/v1/properties/:id/photos | Upload photo |
| DELETE | /api/v1/properties/:id/photos/:photoId | Delete photo |

## Valuations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/valuations | List valuations |
| GET | /api/v1/valuations/:id | Detail |
| POST | /api/v1/valuations | Create valuation |
| PUT | /api/v1/valuations/:id | Update |
| POST | /api/v1/valuations/:id/approve | Approve |
| POST | /api/v1/valuations/:id/reject | Reject |
| POST | /api/v1/valuations/:id/follow-up | Request follow-up |

## Comparables
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/comps | List all |
| GET | /api/v1/comps/search | Search by location |
| POST | /api/v1/comps | Create comp |

## System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Infrastructure health |
| GET | /api/v1/status | API version + uptime |
| WS | /ws | WebSocket endpoint |

---

*Execution Plan v2.0 — Generated from: BUILD-PLAN.md, final-research.md, idea.md, user-journey.md, ui.md, ux.md, overall-design-principles.md*
*For: Aditya Birla Capital — PropFlow MVP*
