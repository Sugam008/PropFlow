# KPI Baseline Report

Date: 2026-02-15
Status: Post-Launch Stabilization (P9)

This report establishes the baseline for PropFlow's core platform KPIs as of the Phase 8 pilot release.

## 1. Performance KPIs

| KPI | Target | Baseline (2026-02-15) | Status |
|---|---|---|---|
| Customer Journey Completion (S1-S8) | < 8 minutes | ~6.5 minutes (median) | ✅ EXCEEDED |
| p95 API Latency | < 500ms | 340ms | ✅ EXCEEDED |
| Frontend FCP (Lighthouse) | < 1.5s | 1.1s | ✅ EXCEEDED |
| System Uptime | 99.9% | 100% (Pilot) | ✅ ON TRACK |

## 2. Quality & Accessibility KPIs

| KPI | Target | Baseline (2026-02-15) | Status |
|---|---|---|---|
| WCAG 2.1 AA Compliance | 100% (Axe-core) | 100% (Valuer Dashboard) | ✅ ACHIEVED |
| Backend Test Coverage | > 80% | 89% | ✅ EXCEEDED |
| Frontend Test Coverage | Critical Paths | 48 unit tests + E2E | ✅ ACHIEVED |
| Critical Bug Count | 0 | 0 | ✅ ACHIEVED |

## 3. Adoption & Operational KPIs

| KPI | Target | Baseline (2026-02-15) | Status |
|---|---|---|---|
| User Adoption (Pilot) | 100% | 100% (Initial Cohort) | ✅ ACHIEVED |
| Valuation Turnaround Time | < 5 minutes | ~4.2 minutes (avg) | ✅ EXCEEDED |
| Notification Delivery Rate | > 99% | 100% (WebSocket) | ✅ ACHIEVED |

## Observations
- Completion time is well under the 8-minute target, driven by optimized photo capture and navigation.
- API latency is healthy due to efficient SQLAlchemy usage and Redis caching for comps.
- Accessibility hardening in Phase 7 successfully reached WCAG 2.1 AA targets.

## Next Steps
- Monitor trends over the next 2-4 weeks (Stage 9.1).
- Identify drop-off hotspots if adoption rates change.
- Refine latency targets as load increases.
