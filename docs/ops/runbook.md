# Operational Runbooks

Incident response and operational procedures for PropFlow.

---

## Incident Response Matrix

| Severity          | Definition                   | Response Time | Examples                                   |
| ----------------- | ---------------------------- | ------------- | ------------------------------------------ |
| **P0 - Critical** | Service down, data loss risk | 15 min        | Database unavailable, complete API failure |
| **P1 - High**     | Major feature broken         | 1 hour        | Photo upload failing, auth broken          |
| **P2 - Medium**   | Feature impaired             | 4 hours       | Slow responses, WebSocket issues           |
| **P3 - Low**      | Minor issues                 | 24 hours      | UI bugs, logging issues                    |

---

## Runbook 1: Backend API Down

### Symptoms

- `/health` endpoint returns 500 or timeout
- Users cannot access the app
- Dashboard shows errors

### Diagnosis

```bash
# Check ECS task status
aws ecs describe-services --cluster propflow --services propflow-api

# Check recent logs
aws logs tail /ecs/propflow-api --follow

# Check database connectivity
aws ecs exec-task --task <task-id> --command "python -c 'from app.database import engine; engine.connect()'"
```

### Resolution

1. **Check for OOM (Out of Memory)**

```bash
# Check CloudWatch metrics
# Look for MemoryUtilization > 90%
```

2. **Restart service**

```bash
aws ecs update-service --cluster propflow --service propflow-api --force-new-deployment
```

3. **Rollback if needed**

```bash
# Get previous task definition
aws ecs list-task-definitions --family propflow-api | head -5

# Rollback
aws ecs update-service --cluster propflow --service propflow-api --task-definition propflow-api:<previous-revision>
```

### Post-Incident

- [ ] Document root cause
- [ ] Update runbook if needed
- [ ] Schedule incident review

---

## Runbook 2: Database Connection Issues

### Symptoms

- API returns 500 with "connection refused"
- Slow queries
- Connection pool exhausted

### Diagnosis

```bash
# Check RDS status
aws rds describe-db-instances --db-instance-identifier propflow-db

# Check connections
aws ecs exec-task --task <task-id> --command "python -c 'from sqlalchemy import text; from app.database import engine; print(list(engine.execute(text(\"SELECT 1\"))))'"
```

### Resolution

1. **Check RDS health**

```bash
# Look for "available" status
aws rds describe-db-instances --db-instance-identifier propflow-db --query 'DBInstances[0].DBInstanceStatus'
```

2. **Check connection string**

```bash
# Verify DATABASE_URL is correct in ECS task
aws ecs describe-task-definition --task-definition propflow-api
```

3. **Reboot RDS (last resort)**

```bash
aws rds reboot-db-instance --db-instance-identifier propflow-db --force-failover
```

---

## Runbook 3: High API Latency

### Symptoms

- API p95 > 500ms
- Users complain of slow responses

### Diagnosis

```bash
# Check API latency in CloudWatch
# Metrics: API/Latency p95, p99

# Check slow queries
aws ecs logs | grep "slow query"

# Check database CPU
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name CPUUtilization \
  --dimensions Name=DBInstanceIdentifier,Value=propflow-db \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average
```

### Resolution

1. **Add read replica**

```bash
aws rds create-db-instance-read-replica \
  --db-instance-identifier propflow-db-read \
  --source-db-instance-identifier propflow-db
```

2. **Optimize queries**

```bash
# Check for missing indexes
# Analyze slow query log
# Add indexes for common queries
```

3. **Scale ECS**

```bash
aws ecs update-service \
  --cluster propflow \
  --service propflow-api \
  --desired-count 4
```

---

## Runbook 4: Photo Upload Failures

### Symptoms

- Users cannot upload photos
- "Upload failed" errors

### Diagnosis

```bash
# Check S3 bucket exists
aws s3 ls propflow-uploads

# Check bucket policy
aws s3api get-bucket-policy --bucket propflow-uploads

# Check ECS logs
aws logs tail /ecs/propflow-api --filter "upload"
```

### Resolution

1. **Verify S3 permissions**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowECSWrite",
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::123456789:role/ecsTaskRole" },
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::propflow-uploads/*"
    }
  ]
}
```

2. **Check bucket capacity**

```bash
aws s3api list-objects-v2 --bucket propflow-uploads --max-keys 1
```

3. **Clear failed uploads**

```bash
# Delete orphaned uploads older than 7 days
aws s3api list-objects-v2 --bucket propflow-uploads \
  | jq -r '.Contents[] | select(.LastModified < (now - 604800)) | .Key' \
  | xargs -r aws s3api delete-object --bucket propflow-uploads --key
```

---

## Runbook 5: WebSocket Disconnections

### Symptoms

- Real-time updates not appearing
- "Reconnecting..." message
- High reconnection rate

### Diagnosis

```bash
# Check Redis (for WebSocket state)
aws elasticache describe-cache-clusters --cache-cluster-id propflow-redis

# Check WebSocket logs
aws logs tail /ecs/propflow-api --filter "websocket"
```

### Resolution

1. **Check Redis connectivity**

```bash
aws ecs exec-task --task <task-id> \
  --command "redis-cli -h $REDIS_HOST ping"
```

2. **Restart WebSocket connections**

```bash
# Force new deployment
aws ecs update-service --cluster propflow --service propflow-api --force-new-deployment
```

3. **Check client connectivity**

```bash
# Verify WebSocket endpoint
wss://api.propflow.com/ws/<token>
```

---

## Runbook 6: SMS/WhatsApp Notifications Not Sending

### Symptoms

- Users not receiving OTPs
- No status update notifications

### Diagnosis

```bash
# Check notification service logs
aws logs tail /ecs/propflow-api --filter "notification"

# Check Twilio balance
# (Requires Twilio console)

# Check WhatsApp API status
# (Requires Meta for Developers console)
```

### Resolution

1. **Verify credentials**

```bash
# Check environment variables in ECS
aws ecs describe-task-definition --task-definition propflow-api
```

2. **Test SMS manually**

```bash
curl -X POST https://api.propflow.com/api/v1/auth/login/otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919999900001"}'
```

3. **Enable fallback notifications**

- Check notification service fallback logic
- Consider alternative provider

---

## Runbook 7: Database Migration Failure

### Symptoms

- Deployment fails at migration step
- "Table already exists" errors
- Data integrity issues

### Diagnosis

```bash
# Check migration logs
alembic history --verbose

# Check current version
alembic current
```

### Resolution

1. **Rollback migration**

```bash
alembic downgrade -1
```

2. **Fix migration script**

```bash
# Edit migration file
# Add IF NOT EXISTS or conflict handling
```

3. **Re-run migrations**

```bash
alembic upgrade head
```

4. **Manual fix (last resort)**

```sql
-- Run manual SQL fix
-- Document in runbook
```

---

## Escalation Matrix

| Time    | Action                          |
| ------- | ------------------------------- |
| 15 min  | P0: Notify on-call engineer     |
| 30 min  | Notify engineering lead         |
| 1 hour  | Notify CTO                      |
| 2 hours | Consider external communication |

### On-Call Contacts

| Role             | Name | Phone | Email |
| ---------------- | ---- | ----- | ----- |
| Primary On-Call  |      |       |       |
| Engineering Lead |      |       |       |
| CTO              |      |       |       |

---

## Recovery Time Objectives

| Service      | RTO    | RPO           |
| ------------ | ------ | ------------- |
| API          | 15 min | 0 (real-time) |
| Database     | 1 hour | 5 min         |
| File Storage | 1 hour | 24 hours      |
| Frontend     | 5 min  | N/A           |

---

## Post-Incident Checklist

- [ ] Root cause identified
- [ ] Impact documented
- [ ] Timeline created
- [ ] Fix implemented
- [ ] Runbook updated
- [ ] Team debriefed
- [ ] Follow-up tickets created
