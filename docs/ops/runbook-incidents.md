# Incident Response Runbook

This runbook provides procedures for handling common production incidents in the PropFlow platform.

## Incident Severity Levels
- **P0 (Critical)**: Entire platform down; critical data loss.
- **P1 (High)**: Major feature broken (e.g., valuation submission failing); high latency.
- **P2 (Medium)**: Non-critical feature broken; branding issues.
- **P3 (Low)**: Minor UI bugs; documentation typos.

## Common Scenarios

### 1. Database Connection Failures
- **Symptom**: Backend `/health` returns 503; logs show `PostgreSQL connection timeout`.
- **Action**:
  1. Check DB instance health in the cloud console.
  2. Verify DB credentials and network policies.
  3. Check connection pool utilization in backend logs.
  4. Restart DB if necessary.

### 2. Redis/Celery Task Delays
- **Symptom**: Valuation processing stuck; `/health` reports Redis error.
- **Action**:
  1. Check Redis memory usage.
  2. Inspect Celery worker logs for crashes.
  3. Clear stale tasks if backlog is overwhelming: `celery -A app.worker purge`.
  4. Scale up worker replicas if latency persists.

### 3. Frontend Performance Degradation
- **Symptom**: High TTFB; Lighthouse scores drop in production.
- **Action**:
  1. Verify CDN cache hit ratios.
  2. Check for heavy assets recently deployed.
  3. Inspect Vercel/Next.js runtime logs for server-side bottlenecks.

## Communication Plan
1. **Notify Team**: Post in `#incident-response` Slack channel.
2. **Internal Status**: Update internal status page every 15 minutes for P0/P1.
3. **External Status**: Inform key stakeholders if downtime exceeds 30 minutes.

## Post-Mortem Requirement
A post-mortem must be conducted within 48 hours for all P0 and P1 incidents to prevent recurrence.
