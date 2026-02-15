# Deployment Guide

This guide covers deploying PropFlow to production infrastructure.

## Prerequisites

- Docker & Docker Compose installed
- Access to cloud provider (AWS)
- Node.js 18+ and pnpm 8+
- Python 3.11+
- Access to secrets management

## Environment Variables

### Backend

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:5432/propflow
REDIS_URL=redis://host:6379
JWT_SECRET_KEY=<generate-secure-key>
SECRET_KEY=<generate-secure-key>

# Optional - Twilio (SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

# Optional - WhatsApp
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=

# Optional - Google Vision
GOOGLE_VISION_API_KEY=

# S3/MinIO
S3_ENDPOINT_URL=https://s3.amazonaws.com
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
S3_BUCKET=propflow-uploads
```

### Frontend (Valuer Dashboard)

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.production.com
```

## Quick Start (Local)

```bash
# Clone repository
git clone https://github.com/your-org/PropFlow.git
cd PropFlow

# Start infrastructure
docker-compose up -d

# Run migrations
cd backend
alembic upgrade head

# Seed data (optional)
python scripts/seed.py

# Start backend
uvicorn app.main:app --reload

# Start frontend
cd frontend/apps/valuer-dashboard
pnpm dev
```

## Docker Deployment

### Backend

```bash
# Build image
docker build -t propflow-api:latest -f backend/Dockerfile .

# Run container
docker run -d \
  --name propflow-api \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_URL=redis://... \
  -e JWT_SECRET_KEY=... \
  propflow-api:latest
```

### Frontend (Next.js)

```bash
# Build image
docker build -t propflow-dashboard:latest -f frontend/apps/valuer-dashboard/Dockerfile .

# Run container
docker run -d \
  --name propflow-dashboard \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.production.com \
  propflow-dashboard:latest
```

## Production Deployment (AWS)

### Infrastructure Components

| Service       | AWS Resource      | Purpose              |
| ------------- | ----------------- | -------------------- |
| Compute       | ECS Fargate       | Container hosting    |
| Database      | RDS PostgreSQL    | Primary database     |
| Cache         | ElastiCache Redis | Sessions, caching    |
| Storage       | S3                | Photo uploads        |
| CDN           | CloudFront        | Static assets        |
| Load Balancer | ALB               | Traffic distribution |
| DNS           | Route 53          | Domain management    |
| Certificate   | ACM               | SSL/TLS              |

### Terraform Setup

```bash
cd infrastructure
terraform init
terraform plan -var-file=production.tfvars
terraform apply -var-file=production.tfvars
```

### ECS Deployment

```bash
# Push images to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY

docker tag propflow-api:latest $ECR_REGISTRY/propflow-api:latest
docker push $ECR_REGISTRY/propflow-api:latest

# Update ECS service
aws ecs update-service --cluster propflow --service propflow-api --force-new-deployment
```

## Mobile App Build

### Android

```bash
# Using EAS (Expo)
cd frontend/apps/customer-app
eas build -p android --profile production

# Or local build
expo prebuild --platform android
cd android
./gradlew assembleRelease
```

### iOS

```bash
# Requires Apple Developer account
cd frontend/apps/customer-app
eas build -p ios --profile production
```

## DNS & SSL

1. Register domain in Route 53
2. Request SSL certificate via ACM
3. Create ALB with HTTPS listener
4. Point DNS to ALB

```
propflow.com -> CloudFront -> ALB -> ECS
api.proflow.com -> CloudFront -> ALB -> ECS
```

## Health Checks

| Endpoint             | Purpose         |
| -------------------- | --------------- |
| `GET /health`        | Backend health  |
| `GET /api/v1/status` | API status      |
| `GET /`              | Frontend health |

## Rollback Procedure

### Backend

```bash
# List previous versions
aws ecs list-task-definitions --family propflow-api

# Rollback to previous revision
aws ecs update-service \
  --cluster propflow \
  --service propflow-api \
  --task-definition propflow-api:<previous-revision>
```

### Frontend

```bash
# Previous deployment is preserved in ECR
aws ecs update-service \
  --cluster propflow \
  --service propflow-dashboard \
  --task-definition propflow-dashboard:<previous-revision>
```

## Monitoring

### Key Metrics

- API response time (p95 < 500ms)
- Error rate (< 1%)
- Queue processing time
- Photo upload success rate

### Alerts

- High error rate (> 5%)
- API latency (> 1s)
- Failed photo uploads
- Database connection issues

## Troubleshooting

### Backend won't start

```bash
# Check logs
docker logs propflow-api

# Verify environment
docker exec propflow-api env | grep -E "DATABASE|REDIS|JWT"

# Check database connection
docker exec propflow-api python -c "from app.database import engine; engine.connect()"
```

### Frontend 502 errors

```bash
# Check backend is running
curl http://localhost:8000/health

# Check ALB target health
aws elbv2 describe-target-health --target-group-arn <arn>
```

### Photo uploads failing

```bash
# Check S3 permissions
aws s3 ls s3://propflow-uploads/

# Verify bucket policy
aws s3api get-bucket-policy --bucket propflow-uploads
```
