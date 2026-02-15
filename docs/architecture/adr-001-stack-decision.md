# ADR 001: Production Technology Stack

## Status
Proposed

## Context
PropFlow requires a high-performance, secure, and scalable stack to handle self-valuation for LAP (Loan Against Property). Key requirements include real-time updates, fraud prevention (GPS/EXIF), and low-latency API response (< 500ms).

## Decision
We will use the following technology stack for the Production Build (Track B):

- **Backend**: FastAPI (Python 3.11+)
  - Rationale: High performance (async support), excellent documentation (OpenAPI), and strong ecosystem for image processing and fraud detection.
- **Database**: PostgreSQL
  - Rationale: Robust relational data model, PostGIS support for GPS validation if needed.
- **Customer Mobile App**: React Native with Expo
  - Rationale: Cross-platform (iOS/Android) support, fast development cycle, native camera and GPS access.
- **Valuer Dashboard**: Next.js 14 (App Router)
  - Rationale: Server-side rendering for SEO (if needed) and performance, robust routing, and React ecosystem for complex UI.
- **State Management**: Zustand or TanStack Query
- **Styling**: Tailwind CSS (Web) / NativeWind (Mobile)

## Infrastructure Assumptions
- **Object Storage**: AWS S3 (for property photos)
- **Cache/Queue**: Redis
- **Background Tasks**: Celery
- **Real-time**: WebSockets (FastAPI native)

## Consequences
- Requires Python and Node.js expertise in the team.
- Monorepo structure will be used to share types and utils across frontend apps.
