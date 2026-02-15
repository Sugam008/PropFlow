# PropFlow Deployment Guide

## Prerequisites

- AWS Account with appropriate permissions
- Terraform >= 1.5.0
- Docker >= 24.0
- pnpm >= 8.0
- Python >= 3.11
- Expo CLI (for mobile builds)

## Infrastructure Setup

### 1. Initialize Terraform

```bash
cd infrastructure
terraform init
```

### 2. Create Terraform Backend

Create S3 bucket and DynamoDB table for state:

```bash
aws s3 mb s3://propflow-terraform-state --region ap-south-1
aws s3api put-bucket-versioning --bucket propflow-terraform-state --versioning-configuration Status=Enabled
aws dynamodb create-table --table-name propflow-terraform-locks --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --billing-mode PAY_PER_REQUEST --region ap-south-1
```

### 3. Configure Variables

Create `terraform.tfvars`:

```hcl
aws_region   = "ap-south-1"
environment  = "staging"
db_password  = "<secure-password>"
jwt_secret   = "<jwt-secret-key>"
```

### 4. Deploy Infrastructure

```bash
terraform plan -out=tfplan
terraform apply tfplan
```

### 5. Note Outputs

```bash
terraform output
```

Save these values for application configuration.

## Application Deployment

### Backend (ECS)

1. Build and push Docker image:

   ```bash
   cd backend
   docker build -t propflow-backend .
   docker tag propflow-backend:latest <ecr-registry>/propflow-backend:latest
   docker push <ecr-registry>/propflow-backend:latest
   ```

2. Run database migrations:

   ```bash
   alembic upgrade head
   ```

3. Update ECS service:
   ```bash
   aws ecs update-service --cluster propflow-cluster-staging --service propflow-backend --force-new-deployment
   ```

### Dashboard (ECS)

1. Build and push:

   ```bash
   docker build -t propflow-dashboard -f frontend/apps/valuer-dashboard/Dockerfile .
   docker tag propflow-dashboard:latest <ecr-registry>/propflow-dashboard:latest
   docker push <ecr-registry>/propflow-dashboard:latest
   ```

2. Update ECS service

### Mobile App (EAS)

1. Configure EAS:

   ```bash
   cd frontend/apps/customer-app
   eas login
   eas build:configure
   ```

2. Build for preview:

   ```bash
   eas build --platform android --profile preview
   ```

3. Build for production:
   ```bash
   eas build --platform android --profile production
   eas submit --platform android --latest
   ```

## Environment Variables

### Backend

| Variable              | Description                  |
| --------------------- | ---------------------------- |
| DATABASE_URL          | PostgreSQL connection string |
| REDIS_URL             | Redis connection string      |
| JWT_SECRET            | Secret for JWT signing       |
| AWS_ACCESS_KEY_ID     | AWS access key               |
| AWS_SECRET_ACCESS_KEY | AWS secret key               |
| S3_BUCKET             | S3 bucket for photos         |
| SENTRY_DSN            | Sentry error tracking        |
| TWILIO_ACCOUNT_SID    | Twilio account               |
| TWILIO_AUTH_TOKEN     | Twilio auth token            |

### Dashboard

| Variable                 | Description         |
| ------------------------ | ------------------- |
| NEXT_PUBLIC_API_URL      | Backend API URL     |
| NEXT_PUBLIC_WS_URL       | WebSocket URL       |
| NEXT_PUBLIC_MAPBOX_TOKEN | Mapbox access token |

## Rollback Procedure

### Quick Rollback

```bash
# List task definitions
aws ecs list-task-definitions --family-prefix propflow-backend

# Rollback to previous version
aws ecs update-service \
  --cluster propflow-cluster-staging \
  --service propflow-backend \
  --task-definition propflow-backend:PREVIOUS_VERSION
```

### Database Rollback

```bash
# Check current migration
alembic current

# Rollback one migration
alembic downgrade -1

# Rollback to specific revision
alembic downgrade <revision>
```

## Monitoring

### Health Checks

- Backend: `GET /health`
- Dashboard: `GET /api/health`

### Logs

```bash
# ECS logs
aws logs tail /ecs/propflow-backend --follow

# CloudWatch Insights
aws logs start-query --log-group-name /ecs/propflow-backend
```

### Alerts

Configure CloudWatch alarms for:

- CPU utilization > 80%
- Memory utilization > 80%
- 5xx error rate > 1%
- Response time p95 > 500ms

## Security Checklist

- [ ] All secrets in AWS Secrets Manager
- [ ] TLS enabled on ALB
- [ ] S3 bucket encryption enabled
- [ ] RDS encryption at rest
- [ ] VPC Flow Logs enabled
- [ ] WAF rules configured
- [ ] Security groups minimal access
