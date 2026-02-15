# Deployment & Operations Guide

This guide covers deployment procedures, infrastructure management, and operational practices for PropFlow.

## Deployment Overview

| Environment | Purpose     | Platform                        |
| ----------- | ----------- | ------------------------------- |
| Local       | Development | Docker Compose                  |
| Staging     | Testing     | AWS (ECS, RDS, ElastiCache)     |
| Production  | Live system | AWS (ECS, RDS, ElastiCache, S3) |

---

## Infrastructure Components

### AWS Resources

| Resource          | Type          | Purpose                        |
| ----------------- | ------------- | ------------------------------ |
| VPC               | Network       | Isolated network (10.0.0.0/16) |
| RDS PostgreSQL    | Database      | Primary data store             |
| ElastiCache Redis | Cache         | Session, OTP, queue            |
| S3 Bucket         | Storage       | Photo storage                  |
| ECS Cluster       | Compute       | Container orchestration        |
| ALB               | Load Balancer | Traffic distribution           |
| ECR               | Registry      | Docker image storage           |

### Architecture Diagram

```
                    ┌─────────────────┐
                    │   Route 53      │
                    │   (DNS)         │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   ALB           │
                    │ (Load Balancer) │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
       ┌──────▼──────┐ ┌─────▼─────┐ ┌─────▼─────┐
       │  ECS Task   │ │ ECS Task  │ │ ECS Task  │
       │  (Backend)  │ │ (Backend) │ │ (Frontend)│
       └──────┬──────┘ └─────┬─────┘ └─────┬─────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
  ┌──────▼──────┐    ┌───────▼───────┐   ┌──────▼──────┐
  │     RDS     │    │  ElastiCache  │   │     S3      │
  │ (PostgreSQL)│    │    (Redis)    │   │  (Photos)   │
  └─────────────┘    └───────────────┘   └─────────────┘
```

---

## Local Deployment (Docker Compose)

### docker-compose.yml Services

| Service          | Image              | Port       | Purpose                  |
| ---------------- | ------------------ | ---------- | ------------------------ |
| db               | postgres:16-alpine | 5432       | PostgreSQL database      |
| redis            | redis:7-alpine     | 6379       | Cache and message broker |
| minio            | minio/minio        | 9000, 9001 | S3-compatible storage    |
| minio-init       | minio/mc           | -          | Bucket initialization    |
| api              | Built locally      | 8000       | FastAPI backend          |
| worker           | Built locally      | -          | Celery worker            |
| beat             | Built locally      | -          | Celery scheduler         |
| valuer-dashboard | Built locally      | 3000       | Next.js frontend         |

### Starting Local Stack

```bash
# Start infrastructure
docker-compose up -d db redis minio minio-init

# Verify services
docker-compose ps

# View logs
docker-compose logs -f api

# Stop all
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Health Check

```bash
# Backend health
curl http://localhost:8000/health

# Expected response
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected"
}
```

---

## CI/CD Pipeline

### Pipeline Overview

```
Push/PR ──► CI Pipeline ──► Tests Pass ──► Merge to Main
                                           │
                                           ▼
                               Deploy Pipeline Triggered
                                           │
                     ┌─────────────────────┼─────────────────────┐
                     │                     │                     │
              Deploy Backend        Deploy Dashboard       Build Mobile
                     │                     │                     │
                     ▼                     ▼                     ▼
               ECS (Staging)         ECS (Staging)        EAS Build
                     │                     │                     │
                     └─────────────────────┼─────────────────────┘
                                           │
                                           ▼
                                   Run Migrations
                                           │
                                           ▼
                                   Production Deploy
```

### CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:** Push to main, Pull requests to main

| Job        | Steps                                                                            |
| ---------- | -------------------------------------------------------------------------------- |
| `backend`  | Python setup, Install deps, Ruff lint, Mypy, Pytest (80% coverage), Docker build |
| `frontend` | Node setup, pnpm install, Lint, Typecheck, Vitest, Build, Playwright E2E         |
| `mobile`   | Node setup, pnpm install, Lint, Typecheck, Expo prebuild, Android build          |
| `security` | pip-audit scan                                                                   |

### Deploy Pipeline (`.github/workflows/deploy.yml`)

**Triggers:** Push to main, Manual workflow_dispatch

| Job                | Actions                        |
| ------------------ | ------------------------------ |
| `deploy-backend`   | AWS auth, ECR push, ECS deploy |
| `deploy-dashboard` | AWS auth, ECR push, ECS deploy |
| `build-mobile`     | EAS Build for Android          |
| `run-migrations`   | Execute Alembic migrations     |
| `notify`           | Post-deploy notifications      |

### Running CI Locally

```bash
# Lint all
pnpm lint

# Type check all
pnpm type-check

# Run all tests
pnpm test

# Backend specific
cd backend && ruff check . && mypy . && pytest

# Frontend specific
pnpm --filter @propflow/valuer-dashboard lint
pnpm --filter @propflow/valuer-dashboard test
```

---

## Terraform Infrastructure

### File Structure

```
infrastructure/
├── main.tf          # Main infrastructure definition
├── variables.tf     # Input variables
├── outputs.tf       # Output values
└── terraform.tfvars # Variable values (gitignored)
```

### Key Resources (`main.tf`)

```hcl
# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
}

# RDS PostgreSQL
resource "aws_db_instance" "main" {
  engine         = "postgres"
  engine_version = "16"
  instance_class = "db.t3.small"
  allocated_storage = 20
  storage_encrypted = true
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "main" {
  cluster_id      = "propflow-redis"
  engine          = "redis"
  node_type       = "cache.t3.small"
  num_cache_nodes = 1
}

# S3 Bucket
resource "aws_s3_bucket" "photos" {
  bucket = "propflow-photos"
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "propflow-cluster"
}
```

### Terraform Commands

```bash
cd infrastructure

# Initialize
terraform init

# Plan changes
terraform plan

# Apply changes
terraform apply

# Destroy (caution!)
terraform destroy
```

### Backend Configuration

```hcl
terraform {
  backend "s3" {
    bucket         = "propflow-terraform-state"
    key            = "terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "propflow-terraform-locks"
  }
}
```

---

## Database Migrations

### Alembic Commands

```bash
cd backend

# Create migration
alembic revision --autogenerate -m "Add new column"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View history
alembic history

# Current version
alembic current
```

### Migration Best Practices

1. **Review generated migrations** before applying
2. **Test migrations** on staging first
3. **Backup database** before production migrations
4. **Use transactions** in migration files
5. **Don't modify existing migrations** after deployment

### Production Migration Workflow

```bash
# In CI/CD pipeline or manually:
alembic upgrade head

# If migration fails:
alembic downgrade -1
# Fix issue
alembic upgrade head
```

---

## Monitoring & Alerting

### Health Endpoints

| Endpoint             | Service  | Check                   |
| -------------------- | -------- | ----------------------- |
| `GET /health`        | Backend  | DB + Redis connectivity |
| `GET /api/v1/status` | Backend  | API status              |
| `GET /`              | Frontend | Basic check             |

### CloudWatch Metrics

| Metric            | Description        | Alert Threshold    |
| ----------------- | ------------------ | ------------------ |
| API Latency (p95) | Request duration   | > 1000ms for 5 min |
| Error Rate        | 5xx responses      | > 5% for 5 min     |
| DB Connections    | Active connections | > 80% capacity     |
| Queue Size        | Pending reviews    | > 50 for 30 min    |
| Disk Usage        | Storage capacity   | > 85%              |

### CloudWatch Alarms

| Alarm               | Metric           | Threshold | Action           |
| ------------------- | ---------------- | --------- | ---------------- |
| HighErrorRate       | 5xx count        | > 5%      | SNS notification |
| HighLatency         | p95 latency      | > 1000ms  | SNS notification |
| DatabaseConnections | Connection count | > 80%     | SNS notification |
| QueueBacklog        | Queue depth      | > 50      | SNS notification |

### Sentry Integration

```python
# Backend
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="YOUR_DSN",
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,
)
```

```typescript
// Frontend
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'YOUR_DSN',
  tracesSampleRate: 0.1,
});
```

---

## Runbooks

### Incident Severity Levels

| Level         | Definition                   | Response Time |
| ------------- | ---------------------------- | ------------- |
| P0 - Critical | Service down, data loss risk | 15 minutes    |
| P1 - High     | Major feature broken         | 1 hour        |
| P2 - Medium   | Feature impaired             | 4 hours       |
| P3 - Low      | Minor issues                 | 24 hours      |

### Common Incidents

#### Backend API Down

```bash
# 1. Check ECS task status
aws ecs describe-services --cluster propflow-cluster --services api

# 2. Check logs
aws logs tail /aws/ecs/propflow-api --follow

# 3. Check for OOM
aws ecs describe-tasks --cluster propflow-cluster --tasks TASK_ID

# 4. Restart service
aws ecs update-service --cluster propflow-cluster --service api --force-new-deployment
```

#### Database Connection Issues

```bash
# 1. Check RDS status
aws rds describe-db-instances --db-instance-identifier propflow-db

# 2. Check connection count
psql -h HOST -U USER -d propflow -c "SELECT count(*) FROM pg_stat_activity;"

# 3. Kill long-running queries
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND query_start < NOW() - INTERVAL '5 minutes';
```

#### High Latency

```bash
# 1. Check CloudWatch metrics
aws cloudwatch get-metric-statistics --namespace AWS/ApplicationELB --metric-name TargetResponseTime

# 2. Identify slow queries
SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

# 3. Scale if needed
aws ecs update-service --cluster propflow-cluster --service api --desired-count 4
```

#### Photo Upload Failures

```bash
# 1. Check S3 bucket
aws s3 ls s3://propflow-photos/

# 2. Check bucket permissions
aws s3api get-bucket-policy --bucket propflow-photos

# 3. Check MinIO (local)
docker-compose logs minio
```

### Recovery Time Objectives

| Service      | RTO    | RPO           |
| ------------ | ------ | ------------- |
| API          | 15 min | 0 (real-time) |
| Database     | 1 hour | 5 min         |
| File Storage | 1 hour | 24 hours      |
| Frontend     | 5 min  | N/A           |

---

## Environment Variables

### Production Checklist

| Variable                | Required | Description           |
| ----------------------- | -------- | --------------------- |
| `SECRET_KEY`            | ✓        | JWT signing key       |
| `DATABASE_URL`          | ✓        | PostgreSQL connection |
| `REDIS_HOST`            | ✓        | Redis endpoint        |
| `S3_BUCKET`             | ✓        | Photo storage bucket  |
| `AWS_ACCESS_KEY_ID`     | ✓        | AWS credentials       |
| `AWS_SECRET_ACCESS_KEY` | ✓        | AWS credentials       |
| `TWILIO_ACCOUNT_SID`    |          | SMS provider          |
| `GOOGLE_VISION_API_KEY` |          | Image analysis        |

### Secrets Management

- **Development**: `.env` files (gitignored)
- **Production**: AWS Secrets Manager
- **CI/CD**: GitHub Secrets

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Migration scripts reviewed
- [ ] Environment variables configured
- [ ] Database backup taken

### Deployment

- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Verify migrations
- [ ] Deploy to production
- [ ] Run migrations
- [ ] Verify health endpoints

### Post-Deployment

- [ ] Monitor logs for errors
- [ ] Verify key user flows
- [ ] Update documentation if needed
- [ ] Notify stakeholders

---

## Scaling Guidelines

### Horizontal Scaling

```bash
# Scale backend
aws ecs update-service --cluster propflow-cluster --service api --desired-count 4

# Scale Celery workers
aws ecs update-service --cluster propflow-cluster --service worker --desired-count 2
```

### Vertical Scaling

```hcl
# Terraform - upgrade RDS instance
resource "aws_db_instance" "main" {
  instance_class = "db.t3.medium"  # Was db.t3.small
}
```

### Auto Scaling

```hcl
# ECS auto scaling
resource "aws_appautoscaling_target" "api" {
  max_capacity       = 10
  min_capacity       = 2
  resource_id        = "service/propflow-cluster/api"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}
```

---

## Related Documentation

- [Runbook](../ops/runbook.md) - Detailed incident procedures
- [Deployment Guide](../ops/deployment-guide.md) - Step-by-step deployment
- [Monitoring](../ops/monitoring.md) - Monitoring setup details
- [Security Hardening](../security/security-hardening.md) - Security practices
