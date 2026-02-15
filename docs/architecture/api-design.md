# API Design

## Endpoints Overview

### Auth
- `POST /api/v1/auth/login/otp`: Request OTP for phone login.
- `POST /api/v1/auth/verify-otp`: Verify OTP and return auth token + user.
- `POST /api/v1/auth/login/access-token`: Password login for service/testing flows.
- `POST /api/v1/auth/refresh`: Refresh access token.
- `POST /api/v1/auth/logout`: Logout acknowledgement endpoint.

### Service Status
- `GET /health`: Service liveness check.
- `GET /api/v1/status`: API status endpoint.

### Properties
- `GET /api/v1/properties`: List properties (filtered by role).
- `POST /api/v1/properties`: Create property draft.
- `GET /api/v1/properties/{id}`: Get property details.
- `PATCH /api/v1/properties/{id}`: Update property.
- `POST /api/v1/properties/{id}/submit`: Submit for review.

### Photos
- `POST /api/v1/properties/{id}/photos`: Upload photo.
- `GET /api/v1/properties/{id}/photos`: List photos.

### Valuations
- `POST /api/v1/valuations`: Create valuation for property.
- `GET /api/v1/comps`: Search comparable properties.

## Real-time Notifications
- `WS /api/v1/ws/{token}`: WebSocket connection for status updates.
