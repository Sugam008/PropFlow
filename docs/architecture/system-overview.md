# System Overview

## High-Level Architecture

PropFlow follows a monorepo architecture with a clear separation between the backend API and frontend applications.

```mermaid
graph TD
    subgraph Clients
        Mobile[Customer Mobile App - Expo]
        Dashboard[Valuer Dashboard - Next.js]
    end

    subgraph API
        FastAPI[FastAPI Backend]
    end

    subgraph Infrastructure
        DB[(PostgreSQL 16)]
        Cache[(Redis 7)]
        Storage[(MinIO Object Storage)]
    end

    Mobile --> FastAPI
    Dashboard --> FastAPI
    FastAPI --> DB
    FastAPI --> Cache
    FastAPI --> Storage
```

## Core Components

- **Backend**: Python FastAPI serving REST and WebSocket endpoints.
- **Customer App**: Expo-based React Native app for property data collection.
- **Valuer Dashboard**: Next.js application for property review and valuation.
- **Shared UI**: (Future) Shared component library and logic.
