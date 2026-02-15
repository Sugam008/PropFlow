# Architecture Deep Dive

This document provides a comprehensive overview of PropFlow's architecture, design decisions, and system interactions.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PropFlow Architecture                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐          │
│   │   Customer   │     │    Valuer    │     │    Admin     │          │
│   │     App      │     │  Dashboard   │     │   Portal     │          │
│   │ (React Native)│     │  (Next.js)   │     │   (Future)   │          │
│   └──────┬───────┘     └──────┬───────┘     └──────┬───────┘          │
│          │                    │                    │                   │
│          └────────────────────┼────────────────────┘                   │
│                               │                                         │
│                       ┌───────▼───────┐                                │
│                       │  API Gateway  │                                │
│                       │   (FastAPI)   │                                │
│                       └───────┬───────┘                                │
│                               │                                         │
│          ┌────────────────────┼────────────────────┐                   │
│          │                    │                    │                   │
│   ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐            │
│   │  PostgreSQL │     │    Redis    │     │  MinIO/S3   │            │
│   │  (Database) │     │ (Cache/Queue)│     │  (Storage)  │            │
│   └─────────────┘     └─────────────┘     └─────────────┘            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Architecture Decisions Records (ADRs)

### ADR-001: Stack Decision

**Status**: Accepted

**Context**: Need to build a property valuation platform with mobile app for customers and web dashboard for valuers.

**Decision**:

- **Backend**: FastAPI (Python 3.11) for rapid API development, async support, automatic OpenAPI docs
- **Web Frontend**: Next.js 14 with App Router for SEO, SSR, and modern React patterns
- **Mobile**: React Native with Expo for cross-platform development with native capabilities
- **Database**: PostgreSQL for relational data integrity and ACID compliance
- **Cache/Queue**: Redis for caching, OTP storage, and Celery message broker
- **Storage**: MinIO (dev) / S3 (prod) for photo storage

**Consequences**:

- Strong typing with Pydantic (backend) and TypeScript (frontend)
- Monorepo enables code sharing between web and mobile
- Fast development cycle with hot reload across all platforms

### ADR-002: Monorepo Structure

**Status**: Accepted

**Context**: Multiple frontend applications need shared components, types, and utilities.

**Decision**: Use pnpm workspaces with Turborepo for monorepo management.

**Structure**:

```
frontend/
├── apps/
│   ├── valuer-dashboard/    # Next.js web app
│   └── customer-app/        # React Native mobile app
└── packages/
    ├── theme/               # Design tokens
    ├── types/               # Shared TypeScript types
    ├── ui/                  # Shared UI components
    └── utils/               # Shared utilities
```

**Consequences**:

- Single source of truth for types and design tokens
- Easier refactoring across applications
- Faster CI with Turborepo caching

---

## Backend Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Application                      │
├─────────────────────────────────────────────────────────────┤
│  Middleware: Security Headers | CORS | Logging | Rate Limit │
├─────────────────────────────────────────────────────────────┤
│  API Layer: Endpoints (auth, users, properties, etc.)       │
├─────────────────────────────────────────────────────────────┤
│  Dependencies: Auth | DB Session | Role Checks              │
├─────────────────────────────────────────────────────────────┤
│  Service Layer: Business Logic (OTP, Storage, Image, etc.)  │
├─────────────────────────────────────────────────────────────┤
│  CRUD Layer: Generic base + specialized operations          │
├─────────────────────────────────────────────────────────────┤
│  Models: User | Property | PropertyPhoto | Valuation | etc. │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure: PostgreSQL | Redis | S3/MinIO | Celery     │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

```
Client Request
     │
     ▼
┌─────────────┐
│ Middleware  │ ─── Security headers, CORS, logging
└─────────────┘
     │
     ▼
┌─────────────┐
│  API Route  │ ─── Endpoint handler
└─────────────┘
     │
     ▼
┌─────────────┐
│ Dependency  │ ─── Auth validation, DB session
└─────────────┘
     │
     ▼
┌─────────────┐
│  Service    │ ─── Business logic
└─────────────┘
     │
     ▼
┌─────────────┐
│    CRUD     │ ─── Database operations
└─────────────┘
     │
     ▼
┌─────────────┐
│   Model     │ ─── SQLAlchemy ORM
└─────────────┘
     │
     ▼
┌─────────────┐
│  Database   │ ─── PostgreSQL
└─────────────┘
```

### Key Backend Components

#### API Endpoints (`app/api/v1/endpoints/`)

| File            | Purpose                                |
| --------------- | -------------------------------------- |
| `auth.py`       | OTP login, verification, token refresh |
| `users.py`      | User CRUD operations                   |
| `properties.py` | Property management                    |
| `photos.py`     | Photo upload and processing            |
| `valuations.py` | Valuation creation and retrieval       |
| `comps.py`      | Comparable properties                  |
| `analytics.py`  | Dashboard metrics                      |

#### Services (`app/services/`)

| Service               | Purpose                                        |
| --------------------- | ---------------------------------------------- |
| `OTPService`          | OTP generation, storage in Redis, verification |
| `StorageService`      | S3/MinIO file upload, URL generation           |
| `ImageService`        | EXIF extraction, image optimization, QC checks |
| `VisionService`       | Google Vision API integration                  |
| `AnalyticsService`    | KPI metrics, funnel analysis                   |
| `AuditService`        | Entity change logging                          |
| `NotificationService` | SMS/WhatsApp notifications (stub)              |

#### Background Tasks (`app/tasks/`)

| Task            | Purpose                         |
| --------------- | ------------------------------- |
| `process_photo` | EXIF extraction, QC validation  |
| `notifications` | Background notification sending |
| `cleanup`       | Periodic cleanup tasks          |

---

## Frontend Architecture

### Valuer Dashboard (Next.js 14)

#### App Router Structure

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home - Property queue
├── [id]/
│   └── page.tsx        # Property detail view
├── analytics/
│   └── page.tsx        # Analytics dashboard
└── api/
    └── health/
        └── route.ts    # Health check endpoint
```

#### Component Hierarchy

```
RootLayout
└── QueryProvider (TanStack Query)
    └── ToastProvider
        └── WebSocketProvider
            └── ErrorBoundary
                └── ClientLayout
                    ├── Sidebar
                    ├── TopBar
                    └── PageTransition
                        └── {children}
```

#### State Management

| State Type   | Solution        | Purpose                            |
| ------------ | --------------- | ---------------------------------- |
| Server State | TanStack Query  | API data, caching, synchronization |
| Client State | Zustand         | Auth, UI state                     |
| Form State   | React Hook Form | Form handling                      |

### Customer App (React Native)

#### Navigation Structure

```
AppNavigator
├── AuthStack (if not authenticated)
│   ├── WelcomeScreen
│   └── OTPScreen
│
└── MainStack (if authenticated)
    ├── PropertyTypeScreen
    ├── PropertyDetailsScreen
    ├── LocationScreen
    ├── PhotoCaptureScreen
    ├── PhotoReviewScreen
    ├── SubmitScreen
    ├── StatusScreen
    ├── ValuationResultScreen
    └── FollowUpScreen
```

#### Store Structure (Zustand)

| Store              | Purpose                                 |
| ------------------ | --------------------------------------- |
| `useAuthStore`     | Authentication state, token persistence |
| `usePropertyStore` | Draft property with auto-save           |
| `useUIStore`       | UI state management                     |

---

## Data Architecture

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│    User     │       │  Property   │       │  PropertyPhoto  │
├─────────────┤       ├─────────────┤       ├─────────────────┤
│ id (PK)     │───┐   │ id (PK)     │───┐   │ id (PK)         │
│ phone       │   │   │ user_id(FK) │   │   │ property_id(FK) │
│ role        │   └──▶│ type        │   └──▶│ s3_key          │
│ name        │       │ address     │       │ photo_type      │
│ is_active   │       │ status      │       │ gps_lat/lng     │
└─────────────┘       │ area_sqft   │       │ exif_metadata   │
                      │ estimated_  │       │ qc_status       │
                      │ value       │       └─────────────────┘
                      └─────────────┘
                            │
                            │ 1:1
                            ▼
                      ┌─────────────┐
                      │  Valuation  │
                      ├─────────────┤
                      │ id (PK)     │
                      │ property_id │
                      │ valuer_id   │
                      │ amount      │
                      │ confidence  │
                      └─────────────┘
                            │
                            │ 1:N
                            ▼
                      ┌─────────────┐
                      │ Comparable  │
                      ├─────────────┤
                      │ id (PK)     │
                      │ address     │
                      │ area_sqft   │
                      │ sale_price  │
                      │ distance_km │
                      └─────────────┘
```

### Database Design Principles

1. **UUID Primary Keys**: All entities use UUID for unique identification
2. **Timestamps**: All entities have `created_at` and `updated_at`
3. **Soft Constraints**: Status enums enforce workflow state
4. **Audit Trail**: All changes logged to `audit_log` table
5. **JSONB for Flexibility**: EXIF metadata stored as JSONB

---

## Security Architecture

### Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │     │   Backend   │     │    Redis    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │ POST /auth/login/otp                   │
       │──────────────────▶│                   │
       │                   │ Generate OTP      │
       │                   │──────────────────▶│ Store OTP
       │                   │                   │ (5 min TTL)
       │                   │◀──────────────────│
       │  OTP sent response│                   │
       │◀──────────────────│                   │
       │                   │                   │
       │ POST /auth/verify-otp                  │
       │──────────────────▶│                   │
       │                   │ Verify OTP        │
       │                   │──────────────────▶│
       │                   │◀──────────────────│ Valid
       │                   │                   │
       │                   │ Generate JWT      │
       │  JWT token        │                   │
       │◀──────────────────│                   │
```

### Authorization Model

| Role     | Permissions                                   |
| -------- | --------------------------------------------- |
| CUSTOMER | Own properties, own valuations, photo uploads |
| VALUER   | All properties for review, create valuations  |
| ADMIN    | Full system access, user management           |

### Security Headers

All API responses include:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security`
- `Content-Security-Policy`

---

## Real-Time Architecture

### WebSocket Implementation

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │     │   Backend   │     │    Redis    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │ WS /ws/{token}    │                   │
       │──────────────────▶│                   │
       │                   │ Validate JWT      │
       │                   │                   │
       │ Connection        │ Subscribe to      │
       │ established       │ user channel      │
       │◀──────────────────│──────────────────▶│
       │                   │                   │
       │                   │ Property update   │
       │                   │◀──────────────────│ Pub/Sub
       │ Status update     │                   │
       │◀──────────────────│                   │
```

---

## Caching Strategy

### Cache Layers

| Layer         | Technology  | Purpose          |
| ------------- | ----------- | ---------------- |
| HTTP Cache    | Browser/CDN | Static assets    |
| API Cache     | Redis       | Response caching |
| Session Cache | Redis       | OTP, tokens      |

### Cache Invalidation

- Pattern-based invalidation on mutations
- TTL-based expiration (5 min for properties)
- Manual invalidation for critical updates

---

## Scalability Considerations

### Horizontal Scaling

- **Stateless API**: No server-side session state
- **Redis for Session**: Shared session storage
- **S3 for Storage**: Decoupled file storage
- **Celery for Tasks**: Background job processing

### Performance Targets

| Metric            | Target  |
| ----------------- | ------- |
| API p95 Latency   | < 500ms |
| Page Load Time    | < 2s    |
| Photo Upload      | < 5s    |
| WebSocket Message | < 100ms |

---

## Related Documentation

- [Domain Model](../architecture/domain-model.md) - Entity definitions
- [API Design](../architecture/api-design.md) - API contracts
- [Status Lifecycle](../architecture/status-lifecycle.md) - State transitions
- [Security Hardening](../security/security-hardening.md) - Security details
