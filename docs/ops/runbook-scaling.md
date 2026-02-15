# Scaling & Resource Management Runbook

Guidelines for scaling PropFlow components based on traffic and resource utilization.

## Monitoring Thresholds
Scale when the following metrics exceed targets for > 5 minutes:
- **CPU Utilization**: > 70%
- **Memory Utilization**: > 80%
- **Request Latency**: > 500ms (p95)
- **Celery Queue Depth**: > 100 pending tasks

## Scaling Procedures

### 1. Backend API (Horizontal)
Scale the FastAPI application based on HTTP request volume.
```bash
kubectl scale deployment/propflow-api --replicas=5
```

### 2. Celery Workers (Task-based)
Scale workers specifically for image processing and valuation compute.
```bash
kubectl scale deployment/propflow-worker --replicas=10
```

### 3. Database (Vertical)
If DB CPU persists > 80% after optimization:
1. Increase instance size (e.g., from `db.t3.medium` to `db.t3.large`).
2. Implement Read Replicas for heavy read queries (Reporting/Dashboard).

### 4. Redis (Cache/Broker)
Scale Redis if eviction rates are high or memory is exhausted.
1. Increase memory limit in configuration.
2. Consider Redis Cluster for very high throughput.

## Optimization Checklist
Before scaling out, verify:
- [ ] No memory leaks in recent deployments.
- [ ] Database indexes are optimized for slow queries.
- [ ] Frontend assets are correctly cached by CDN.
- [ ] Connection pooling is correctly configured.
