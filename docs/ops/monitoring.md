# Monitoring & Alerts Configuration

Sentry, CloudWatch, and alerting setup for PropFlow.

## Sentry Setup

### Backend (Python/FastAPI)

```python
# backend/app/main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

sentry_sdk.init(
    dsn="https://xxxx@sentry.io/propflow",
    integrations=[
        FastApiIntegration(),
        SqlalchemyIntegration(),
    ],
    traces_sample_rate=0.1,
    environment="production",
)
```

### Frontend (Next.js/React)

```javascript
// frontend/apps/valuer-dashboard/next.config.js
const nextConfig = {
  sentry: {
    // Upload source maps automatically
    autoInstrumentRemix: false,
  },
};
```

```javascript
// Sentry initialization
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://xxxx@sentry.io/propflow',
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

## CloudWatch Metrics

### Dashboard JSON

```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "title": "API Latency",
        "metrics": [
          ["PropFlow/API", "Latency_p50", "Environment", "production"],
          [".", "Latency_p95", ".", "."],
          [".", "Latency_p99", ".", "."]
        ],
        "period": 300,
        "stat": "Average"
      }
    },
    {
      "type": "metric",
      "properties": {
        "title": "Error Rate",
        "metrics": [
          ["PropFlow/API", "5xx_errors", "Environment", "production"],
          [".", "4xx_errors", ".", "."]
        ],
        "period": 300
      }
    },
    {
      "type": "metric",
      "properties": {
        "title": "Active Users",
        "metrics": [["PropFlow/API", "active_users", "Environment", "production"]],
        "period": 3600
      }
    },
    {
      "type": "metric",
      "properties": {
        "title": "Queue Size",
        "metrics": [
          ["PropFlow/Queue", "pending_review", "Environment", "production"],
          [".", "under_review", ".", "."]
        ],
        "period": 300
      }
    }
  ]
}
```

## Alarm Configuration

### CloudWatch Alarms

| Alarm               | Metric              | Threshold          | Action         |
| ------------------- | ------------------- | ------------------ | -------------- |
| HighErrorRate       | API/5xx_errors      | > 5% for 5 min     | Notify on-call |
| HighLatency         | API/Latency_p95     | > 1000ms for 5 min | Notify on-call |
| DatabaseConnections | RDS/ConnectionCount | > 80% for 5 min    | Notify on-call |
| DiskSpace           | ECS/DiskUsage       | > 85%              | Notify on-call |
| QueueBacklog        | Queue/pending       | > 50 for 30 min    | Notify on-call |

### SNS Topics

```bash
# Create SNS topic for alerts
aws sns create-topic --name propflow-alerts

# Subscribe email
aws sns subscribe \
  --topic-arn arn:aws:sns:ap-south-1:123456789:propflow-alerts \
  --protocol email \
  --notification-endpoint oncall@company.com
```

## Alert Rules

### PagerDuty Integration

```yaml
# pagerduty-service.yaml
services:
  - name: PropFlow
    incidents_prioritize: auto
    incident_urgency:
      during_support_hours: low
      outside_support_hours: high
    response_play:
      name: PropFlow Response
      description: Standard PropFlow incident response
      oncalls:
        - schedule_id: oncall-schedule
```

## Business Metrics Dashboard

### Key KPIs

| Metric          | Target   | Current |
| --------------- | -------- | ------- |
| Submissions/Day | 100      | -       |
| Completion Time | < 8 min  | -       |
| Review Time     | < 30 min | -       |
| Approval Rate   | > 70%    | -       |
| Follow-up Rate  | < 20%    | -       |

### Funnel Analytics

| Stage                  | Drop-off | Target |
| ---------------------- | -------- | ------ |
| Welcome → OTP          | < 30%    | < 20%  |
| OTP → Property Details | < 20%    | < 10%  |
| Details → Photos       | < 15%    | < 10%  |
| Photos → Submit        | < 10%    | < 5%   |
| Submit → Approval      | > 70%    | > 80%  |

## Log Queries

### Error Investigation

```bash
# Recent errors
aws logs filter-log-events \
  --log-group /ecs/propflow-api \
  --filter-pattern "ERROR" \
  --start-time $(date -u -d '1 hour ago' +%s)000

# Slow queries
aws logs filter-log-events \
  --log-group /ecs/propflow-api \
  --filter-pattern "slow query" \
  --start-time $(date -u -d '24 hours ago' +%s)000

# Authentication failures
aws logs filter-log-events \
  --log-group /ecs/propflow-api \
  --filter-pattern "401" \
  --start-time $(date -u -d '1 hour ago' +%s)000
```

## Uptime Monitoring

### Health Check Endpoints

| Service  | Endpoint             | Expected |
| -------- | -------------------- | -------- |
| Backend  | `GET /health`        | 200 OK   |
| API      | `GET /api/v1/status` | 200 OK   |
| Frontend | `GET /`              | 200 OK   |

### Cronitor / Healthchecks.io

```bash
# Set up health checks
curl -X POST https://cronitor.link/api/monitors \
  -d "type=ping" \
  -d "name=propflow-api" \
  -d "url=https://api.proflow.com/health"
```

## Grafana Dashboard (Optional)

```yaml
# grafana-dashboard.yaml
apiVersion: 1
providers:
  - name: PropFlow
    folder: PropFlow
    type: file
    options:
      path: /var/lib/grafana/dashboards
```

---

## On-Call Rotation

| Week | Primary    | Secondary  |
| ---- | ---------- | ---------- |
| W1   | Engineer A | Engineer B |
| W2   | Engineer B | Engineer C |
| W3   | Engineer C | Engineer A |

### Handoff Process

1. Review open incidents
2. Check pending deployments
3. Review recent changes
4. Update status page
5. Confirm contact info
