# KPI Dashboard & Tracking

Real-time KPI monitoring for PropFlow operations.

## Dashboard Configuration

### Metabase/Superset Dashboard SQL

```sql
-- Daily Submissions
SELECT
  DATE(created_at) as date,
  COUNT(*) as submissions
FROM properties
WHERE status = 'SUBMITTED'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Average Completion Time
SELECT
  AVG(EXTRACT(EPOCH FROM (reviewed_at - submitted_at))) / 60 as avg_minutes
FROM properties
WHERE status IN ('APPROVED', 'REJECTED')
AND submitted_at IS NOT NULL
AND reviewed_at IS NOT NULL;

-- Approval Rate
SELECT
  COUNT(*) FILTER (WHERE status = 'APPROVED')::float /
  COUNT(*) FILTER (WHERE status IN ('APPROVED', 'REJECTED'))::float * 100 as approval_rate
FROM properties
WHERE status IN ('APPROVED', 'REJECTED');

-- Follow-up Rate
SELECT
  COUNT(*) FILTER (WHERE status = 'FOLLOW_UP')::float /
  COUNT(*)::float * 100 as follow_up_rate
FROM properties
WHERE status IN ('APPROVED', 'REJECTED', 'FOLLOW_UP');

-- Review Time by Valuer
SELECT
  u.name as valuer,
  AVG(EXTRACT(EPOCH FROM (p.reviewed_at - p.submitted_at))) / 60 as avg_review_minutes,
  COUNT(p.id) as properties_reviewed
FROM properties p
JOIN users u ON p.valuer_id = u.id
WHERE p.status IN ('APPROVED', 'REJECTED')
GROUP BY u.name
ORDER BY avg_review_minutes;
```

## KPI Targets & Thresholds

| KPI             | Target   | Warning  | Critical |
| --------------- | -------- | -------- | -------- |
| Submissions/Day | 100      | < 50     | < 20     |
| Completion Time | < 8 min  | > 12 min | > 20 min |
| Approval Rate   | > 70%    | < 50%    | < 30%    |
| Follow-up Rate  | < 20%    | > 30%    | > 50%    |
| Review Time     | < 30 min | > 45 min | > 60 min |

## Alert Configuration

### Daily Report

```python
# backend/app/tasks/daily_kpi_report.py
from celery import shared_task
from sqlalchemy import func
from app.database import SessionLocal
from app.models.property import Property, PropertyStatus
from app.models.user import User

@shared_task
def send_daily_kpi_report():
    db = SessionLocal()

    try:
        # Get metrics
        submissions = db.query(func.count(Property.id)).filter(
            Property.status == PropertyStatus.SUBMITTED
        ).scalar()

        completed = db.query(func.count(Property.id)).filter(
            Property.status.in_([PropertyStatus.APPROVED, PropertyStatus.REJECTED])
        ).scalar()

        # Send to Slack/Email
        message = f"""
        📊 PropFlow Daily Report

        Submissions: {submissions}
        Completed: {completed}
        Pending: {submissions - completed}
        """

        # Integrate with notification service
        return {"status": "sent", "message": message}
    finally:
        db.close()
```

## Funnel Analytics

### Drop-off Analysis

```sql
-- Screen-level drop-off
SELECT
  screen_name,
  COUNT(*) as views,
  COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY screen_order) as drop_off,
  ROUND((COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY screen_order))::float /
    LAG(COUNT(*)) OVER (ORDER BY screen_order) * 100), 1) as drop_off_rate
FROM analytics_events
WHERE event_type = 'screen_view'
GROUP BY screen_name, screen_order
ORDER BY screen_order;
```

## Support Ticket Patterns

```sql
-- Common issues from follow-up requests
SELECT
  issue_type,
  COUNT(*) as occurrences
FROM follow_up_requests
GROUP BY issue_type
ORDER BY COUNT(*) DESC
LIMIT 10;
```

---

## Weekly Review Template

### Week of: ****\_\_\_\_****

| Metric          | Target  | Actual | Status |
| --------------- | ------- | ------ | ------ |
| Submissions     | 100     |        |        |
| Completion Time | < 8 min |        |        |
| Approval Rate   | > 70%   |        |        |
| Follow-up Rate  | < 20%   |        |        |
| P0/P1 Bugs      | 0       |        |        |

### Issues Identified

1. ***
2. ***
3. ***

### Actions Taken

1. ***
2. ***

### Next Week Focus

1. ***
2. ***
