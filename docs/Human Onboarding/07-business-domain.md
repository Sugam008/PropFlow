# Business Domain Guide

This document explains the business context, domain model, and workflows of PropFlow.

## What is PropFlow?

PropFlow is an AI-powered Property Valuation and Workflow Automation platform designed for **Loan Against Property (LAP)** workflows. It enables customers to self-capture property details and photos from their mobile devices, eliminating physical valuer visits while maintaining bank-grade fraud prevention.

---

## Problem Statement

### Traditional Property Valuation Process

| Aspect          | Traditional   | PropFlow          |
| --------------- | ------------- | ----------------- |
| Steps           | 9 steps       | 5 steps           |
| Time            | 5-12 days     | 5 hours (SLA)     |
| Valuer Visit    | Required      | Remote            |
| Customer Effort | High          | Low (phone-based) |
| Cost            | High          | Reduced           |
| Fraud Risk      | Manual checks | Automated checks  |

---

## User Roles

### Customer (Property Owner)

**Profile**: Individual seeking a loan against their property

**Capabilities**:

- Submit property for valuation via mobile app
- Capture property photos (camera-only, no gallery)
- Track valuation status in real-time
- Respond to follow-up requests
- View valuation results and download reports

**User Journey**:

```
Welcome → OTP Login → Property Details → Location → Photos → Submit → Track → Result
```

### Valuer (Bank Staff)

**Profile**: Bank employee responsible for property valuation

**Capabilities**:

- View queue of submitted properties
- Review property photos and details
- Request follow-up information
- Approve with valuation amount
- Reject with reason

**User Journey**:

```
Queue → Select Property → Review → Decision (Approve/Reject/Follow-up) → Next
```

### Admin

**Profile**: System administrator

**Capabilities**:

- Full access to all resources
- User management
- System configuration
- Analytics and reporting

---

## Domain Model

### Core Entities

```
┌─────────────────────────────────────────────────────────────────┐
│                         DOMAIN MODEL                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                                                │
│  │    User     │                                                │
│  ├─────────────┤                                                │
│  │ id          │                                                │
│  │ phone       │ ◄── Primary identifier                         │
│  │ role        │ ◄── CUSTOMER / VALUER / ADMIN                  │
│  │ name        │                                                │
│  │ is_active   │                                                │
│  └──────┬──────┘                                                │
│         │ owns                                                  │
│         ▼                                                       │
│  ┌─────────────┐       ┌─────────────────┐                     │
│  │  Property   │ 1:N   │  PropertyPhoto  │                     │
│  ├─────────────┤──────►├─────────────────┤                     │
│  │ id          │       │ id              │                     │
│  │ type        │       │ property_id     │                     │
│  │ address     │       │ photo_url       │                     │
│  │ coordinates │       │ photo_type      │ ◄─ FRONT/SIDE/INT  │
│  │ area_sqft   │       │ gps_lat/lng     │ ◄─ Fraud check     │
│  │ status      │ ◄─────│ exif_metadata   │ ◄─ Fraud check     │
│  └──────┬──────┘       │ qc_status       │                     │
│         │              └─────────────────┘                     │
│         │ has valuation                                        │
│         ▼                                                       │
│  ┌─────────────┐       ┌─────────────────┐                     │
│  │  Valuation  │ 1:N   │   Comparable    │                     │
│  ├─────────────┤──────►├─────────────────┤                     │
│  │ id          │       │ id              │                     │
│  │ property_id │       │ address         │                     │
│  │ valuer_id   │       │ area_sqft       │                     │
│  │ amount      │ ◄─────│ sale_price      │                     │
│  │ confidence  │       │ distance_km     │                     │
│  │ report_url  │       └─────────────────┘                     │
│  └─────────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Property Types

| Type       | Description                              |
| ---------- | ---------------------------------------- |
| APARTMENT  | Apartment/Flat in a multi-story building |
| HOUSE      | Independent house                        |
| VILLA      | Large independent property               |
| COMMERCIAL | Commercial property (office, shop)       |
| LAND       | Vacant land/plot                         |

### Photo Types

| Type     | Required    | Description                |
| -------- | ----------- | -------------------------- |
| FRONT    | ✓ Mandatory | Front exterior of property |
| SIDE     | Optional    | Side view of property      |
| INTERNAL | ✓ Mandatory | Interior photos            |
| DOCUMENT | Optional    | Property documents         |

---

## Property Status Lifecycle

### State Machine

```
                    ┌─────────────────────────────────────────┐
                    │        PROPERTY STATUS LIFECYCLE        │
                    └─────────────────────────────────────────┘

    [None]
       │
       │ Customer creates property
       ▼
   ┌────────┐
   │ DRAFT  │ ◄── Customer can edit, add photos, update details
   └───┬────┘
       │
       │ Customer submits
       │ Guard: FRONT + INTERNAL photos present
       │ Guard: GPS location captured
       ▼
 ┌──────────────┐
 │   SUBMITTED  │ ◄── Locked for editing
 └──────┬───────┘
        │
        │ Valuer starts review
        ▼
 ┌──────────────┐
 │ UNDER_REVIEW │ ◄── Valuer reviews photos, details
 └──────┬───────┘
        │
        ├─────────────────────────────┐
        │                             │
        │ Valuer requests             │ Valuer approves
        │ clarification               │ with valuation
        ▼                             ▼
┌─────────────────┐            ┌─────────────┐
│ FOLLOW_UP_      │            │  APPROVED   │
│ REQUIRED        │            │             │
└────────┬────────┘            └──────┬──────┘
         │                            │
         │ Customer                   │ Report generated
         │ responds                   │ Notification sent
         │                            │
         └────────────► SUBMITTED     ▼
                                      │
                                      │ Final valuation
                                      ▼
                               ┌─────────────┐
                               │   VALUED    │
                               └─────────────┘

        │                             │
        │ Valuer rejects              │
        ▼                             │
 ┌─────────────┐                      │
 │  REJECTED   │ ◄── Rejection reason │
 └─────────────┘     required         │
                                      │
```

### Status Definitions

| Status             | Owner    | Editable | Description                        |
| ------------------ | -------- | -------- | ---------------------------------- |
| DRAFT              | Customer | Yes      | Initial property entry             |
| SUBMITTED          | Customer | No       | Awaiting valuer assignment         |
| UNDER_REVIEW       | Valuer   | No       | Valuer actively reviewing          |
| FOLLOW_UP_REQUIRED | Customer | Partial  | Customer must provide more info    |
| APPROVED           | Valuer   | No       | Valuation approved, report pending |
| REJECTED           | Valuer   | No       | Valuation rejected                 |
| VALUED             | Valuer   | No       | Final valuation complete           |

---

## Business Rules

### Submission Requirements

| Requirement    | Validation                 |
| -------------- | -------------------------- |
| Minimum photos | FRONT + INTERNAL mandatory |
| GPS location   | Must be captured           |
| Address        | Required with pincode      |
| Area           | Required in sq ft          |

### Valuation Rules

| Rule             | Enforcement                      |
| ---------------- | -------------------------------- |
| Valuation amount | Must be > 0 for approval         |
| Rejection reason | Required for all rejections      |
| Confidence score | Auto-calculated from comparables |
| Comparables      | Minimum 3 suggested              |

### Follow-up Rules

| Rule              | Description                       |
| ----------------- | --------------------------------- |
| Specific fields   | Only requested fields unlocked    |
| Additional photos | Valuer can request specific types |
| Time limit        | Customer has 48 hours to respond  |

---

## Fraud Prevention

### Camera-Only Capture

**Rule**: Photos must be taken live, not selected from gallery

**Implementation**:

- No gallery picker in mobile app
- Direct camera integration
- Immediate capture to app storage

**Why**: Prevents use of old or manipulated photos

### GPS Validation

**Rule**: Photo GPS must be within 0.5km of property address

**Implementation**:

```python
def validate_gps_distance(property_coords, photo_coords):
    distance = haversine_distance(property_coords, photo_coords)
    return distance <= 0.5  # km
```

**Why**: Ensures photos are taken at the actual property

### EXIF Metadata Verification

| Check                | Threshold    | Action on Fail     |
| -------------------- | ------------ | ------------------ |
| Timestamp staleness  | < 30 minutes | Reject photo       |
| Device model present | Required     | Flag for review    |
| GPS metadata present | Required     | Reject photo       |
| Screenshot detection | N/A          | Reject immediately |

**Why**: Ensures photos are fresh and authentic

### Photo Quality Checks

| Check          | Threshold       | Action                    |
| -------------- | --------------- | ------------------------- |
| Blur detection | Sharpness < 30  | Reject with retake prompt |
| Brightness     | < 40 or > 220   | Flag as too dark/bright   |
| Glare          | Highlight > 70% | Reject with guidance      |

---

## SLA & KPIs

### Service Level Targets

| Metric                   | Target      |
| ------------------------ | ----------- |
| Valuation turnaround     | 5 hours     |
| Customer completion time | < 8 minutes |
| Photo upload time        | < 5 seconds |
| API response (p95)       | < 500ms     |

### Business KPIs

| KPI                     | Target  | Warning  | Critical |
| ----------------------- | ------- | -------- | -------- |
| Submissions/Day         | 100     | < 50     | < 20     |
| Completion Rate         | > 80%   | < 60%    | < 40%    |
| Approval Rate           | > 70%   | < 50%    | < 30%    |
| Follow-up Rate          | < 20%   | > 30%    | > 50%    |
| Average Completion Time | < 8 min | > 12 min | > 20 min |

### Analytics Metrics

| Category   | Metrics                            |
| ---------- | ---------------------------------- |
| Volume     | Submissions, Approvals, Rejections |
| Quality    | Photo QC pass rate, GPS match rate |
| Speed      | Time to submit, Time to valuation  |
| Efficiency | Valuations per valuer, Queue depth |

---

## Notification Flows

### Customer Notifications

| Event                   | Channel          | Template                          |
| ----------------------- | ---------------- | --------------------------------- |
| OTP Request             | SMS              | "Your PropFlow OTP is {code}"     |
| Submission Confirmation | Push             | "Property submitted successfully" |
| Status Change           | Push + WebSocket | Real-time status update           |
| Follow-up Request       | Push             | "Additional information required" |
| Valuation Complete      | Push + SMS       | "Your valuation is ready"         |

### Valuer Notifications

| Event              | Channel   | Template                          |
| ------------------ | --------- | --------------------------------- |
| New in Queue       | WebSocket | Real-time queue update            |
| Daily Summary      | Email     | Digest of pending/completed       |
| Follow-up Response | Push      | "Customer responded to follow-up" |

---

## Integration Points

### External Services

| Service           | Purpose                | Integration |
| ----------------- | ---------------------- | ----------- |
| Twilio            | SMS for OTP            | REST API    |
| WhatsApp Business | Customer notifications | REST API    |
| Google Vision     | Image analysis, OCR    | REST API    |
| Mapbox            | Maps, geocoding        | REST API    |

### Data Sources

| Source              | Data             | Usage        |
| ------------------- | ---------------- | ------------ |
| Property Registries | Transaction data | Comparables  |
| Government Portals  | Property records | Verification |

---

## Compliance & Audit

### Audit Trail

All entity changes are logged to the `audit_log` table:

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  entity_type VARCHAR,        -- 'property', 'valuation', etc.
  entity_id UUID,             -- Reference to entity
  action VARCHAR,             -- 'CREATE', 'UPDATE', 'STATUS_CHANGE'
  old_value JSONB,            -- Previous state
  new_value JSONB,            -- New state
  actor_id UUID,              -- User who made change
  timestamp TIMESTAMP
);
```

### Compliance Requirements

| Requirement      | Implementation                      |
| ---------------- | ----------------------------------- |
| Data retention   | 7 years for financial records       |
| PII protection   | Encrypted storage, access logs      |
| Consent          | Explicit opt-in for data collection |
| Right to erasure | Soft delete with audit trail        |

---

## Brand Guidelines

### Brand Identity

- **Parent Brand**: Aditya Birla Capital
- **Brand Essence**: "Money Simplified"
- **Product Tagline**: "Property Valuation Simplified"
- **Core Values**: Integrity, Commitment, Passion, Seamlessness, Speed

### Visual Identity

| Element       | Value                            |
| ------------- | -------------------------------- |
| Primary Color | ABC Red (#E31E24)                |
| Font Family   | System default (Inter/System UI) |
| Border Radius | 8px (md)                         |
| Touch Target  | 44x44px minimum                  |

### UX Principles

1. **Simplicity**: Minimal steps, clear language
2. **Trust**: Transparent process, clear communication
3. **Speed**: Quick completion, fast feedback
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Mobile-First**: Designed for phone usage

---

## Related Documentation

- [Domain Model](../architecture/domain-model.md) - Technical entity definitions
- [State Machine](../product/state-machine.md) - Detailed state transitions
- [Acceptance Criteria](../product/acceptance-criteria.md) - Feature specifications
- [Screen Inventory](../product/screen-inventory.md) - All screens and states
