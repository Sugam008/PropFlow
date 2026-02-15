# Deployment Runbook

This guide outlines the procedure for deploying PropFlow to production environments.

## Prerequisites
- Access to the production Kubernetes cluster or Docker Swarm.
- Production environment variables configured in secret management.
- CI/CD pipeline access (GitHub Actions).

## Deployment Flow

### 1. Automated Deployment (CI/CD)
The primary method for deployment is via the GitHub Actions pipeline.
- **Trigger**: Merging to `main` branch.
- **Actions**:
  1. Lints and tests all packages.
  2. Builds Docker images for Backend and Frontend.
  3. Pushes images to the Container Registry.
  4. Triggers deployment to the target environment.

### 2. Manual Deployment (Fallback)
If the automated pipeline fails, follow these steps:

#### Build Images
```bash
docker-compose -f docker-compose.prod.yml build
```

#### Push to Registry
```bash
docker-compose -f docker-compose.prod.yml push
```

#### Update Environment
```bash
kubectl apply -f k8s/production/
```

## Post-Deployment Verification
1. **Health Checks**: Verify `https://api.propflow.com/health` returns 200.
2. **Logs**: Check for spike in 5xx errors in log aggregation.
3. **Smoke Tests**: Perform a basic property creation and valuation flow.

## Rollback Procedure
If verification fails, rollback to the previous stable image:
1. Identify the previous stable image tag in the registry.
2. Update the deployment manifest with the old tag.
3. Apply the update: `kubectl rollout undo deployment/propflow-api`.
