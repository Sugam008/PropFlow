# Troubleshooting Guide

This guide helps diagnose and resolve common issues encountered during PropFlow development and operations.

## Quick Diagnostics

### Health Check Commands

```bash
# Check all Docker containers
docker-compose ps

# Check backend health
curl http://localhost:8000/health

# Check database connectivity
docker-compose exec db pg_isready -U postgres

# Check Redis connectivity
docker-compose exec redis redis-cli ping

# Check MinIO status
curl http://localhost:9000/minio/health/live
```

### Log Viewing

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f db
docker-compose logs -f redis

# Last 100 lines
docker-compose logs --tail=100 api
```

---

## Setup Issues

### Docker Issues

#### Docker daemon not running

**Symptoms**:

```
Cannot connect to the Docker daemon
```

**Solution**:

```bash
# macOS: Start Docker Desktop
open -a Docker

# Linux: Start Docker service
sudo systemctl start docker

# Verify
docker ps
```

#### Port already in use

**Symptoms**:

```
Error: port is already allocated
```

**Solution**:

```bash
# Find process using port
lsof -i :8000
lsof -i :5432
lsof -i :6379

# Kill process
kill -9 <PID>

# Or use different ports
docker-compose down
# Edit docker-compose.yml to change ports
docker-compose up -d
```

#### Container won't start

**Symptoms**:

```
Container exits immediately
```

**Solution**:

```bash
# Check logs
docker-compose logs <service_name>

# Check container status
docker-compose ps

# Restart container
docker-compose restart <service_name>

# Rebuild container
docker-compose up -d --build <service_name>
```

### Database Issues

#### Connection refused

**Symptoms**:

```
connection to server at "localhost" (127.0.0.1), port 5432 failed
```

**Solution**:

```bash
# Check if PostgreSQL is running
docker-compose ps db

# If not running
docker-compose up -d db

# Wait for database to be ready
docker-compose exec db pg_isready -U postgres

# Check connection string
echo $DATABASE_URL
```

#### Database doesn't exist

**Symptoms**:

```
database "propflow" does not exist
```

**Solution**:

```bash
# Create database
docker-compose exec db psql -U postgres -c "CREATE DATABASE propflow;"

# Run migrations
cd backend
alembic upgrade head
```

#### Migration conflicts

**Symptoms**:

```
alembic.util.exc.CommandError: Can't locate revision identified by 'xxx'
```

**Solution**:

```bash
# Check current migration
alembic current

# View history
alembic history

# If needed, reset migrations
alembic downgrade base
alembic upgrade head

# If tables exist, stamp current version
alembic stamp head
```

### Redis Issues

#### Connection refused

**Symptoms**:

```
redis.exceptions.ConnectionError: Error connecting to Redis
```

**Solution**:

```bash
# Check Redis status
docker-compose ps redis

# Start Redis
docker-compose up -d redis

# Test connection
docker-compose exec redis redis-cli ping
# Should return: PONG
```

#### OTP not found / expired

**Symptoms**:

```
Invalid or expired OTP
```

**Solution**:

```bash
# Check OTP storage
docker-compose exec redis redis-cli
> KEYS otp:*
> GET otp:+911234567890
> TTL otp:+911234567890  # Time to live in seconds

# Clear all OTPs (for testing)
> FLUSHDB
```

---

## Backend Issues

### Import Errors

#### Module not found

**Symptoms**:

```
ModuleNotFoundError: No module named 'app'
```

**Solution**:

```bash
# Ensure you're in the backend directory
cd backend

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

#### Circular imports

**Symptoms**:

```
ImportError: cannot import name 'X' from partially initialized module
```

**Solution**:

```python
# Move imports inside function
def some_function():
    from app.models import Property  # Import inside
    return Property.query.all()

# Or restructure module hierarchy
```

### API Issues

#### 401 Unauthorized

**Symptoms**:

```
{"detail": "Could not validate credentials"}
```

**Solution**:

```bash
# Verify token format
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/v1/users/me

# Check token expiration
# Default: 24 hours (1440 minutes)

# Get new token
curl -X POST http://localhost:8000/api/v1/auth/login/otp \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+911234567890"}'
```

#### 403 Forbidden

**Symptoms**:

```
{"detail": "Insufficient permissions"}
```

**Solution**:

- Check user role has required permissions
- Admin endpoints require ADMIN role
- Property access requires ownership or VALUER/ADMIN role

#### 422 Validation Error

**Symptoms**:

```
{"detail": [{"loc": ["body", "field"], "msg": "field required"}]}
```

**Solution**:

- Check request body matches schema
- Ensure required fields are present
- Validate field types (string, number, etc.)

#### 500 Internal Server Error

**Symptoms**:

```
{"detail": "Internal server error"}
```

**Solution**:

```bash
# Check backend logs
docker-compose logs -f api

# Enable debug mode
uvicorn app.main:app --reload --log-level debug

# Check for unhandled exceptions in logs
```

### Celery Issues

#### Tasks not running

**Symptoms**:

- Background tasks not executing
- Photos not processing

**Solution**:

```bash
# Check Celery worker status
docker-compose ps worker

# Start worker
docker-compose up -d worker

# Check worker logs
docker-compose logs -f worker

# Manually trigger task
cd backend
celery -A app.celery_app call app.tasks.image_processing.process_photo --args='["photo_id"]'
```

---

## Frontend Issues

### Build Issues

#### Module not found

**Symptoms**:

```
Module not found: Can't resolve '@propflow/theme'
```

**Solution**:

```bash
# Install dependencies
pnpm install

# Rebuild shared packages
pnpm --filter @propflow/theme build
pnpm --filter @propflow/types build
pnpm --filter @propflow/ui build
```

#### TypeScript errors

**Symptoms**:

```
Type 'X' is not assignable to type 'Y'
```

**Solution**:

```bash
# Run type check for details
pnpm type-check

# Clear cache and rebuild
rm -rf node_modules .next
pnpm install
pnpm build
```

### Runtime Issues

#### API connection failed

**Symptoms**:

```
Network Error
AxiosError: connect ECONNREFUSED
```

**Solution**:

```bash
# Check API is running
curl http://localhost:8000/health

# Check environment variables
echo $NEXT_PUBLIC_API_BASE_URL

# For PWA on mobile device, use machine IP
# Physical device: http://<machine-ip>:8000/api/v1
# Ensure firewall allows connection on port 8000
```

#### WebSocket disconnection

**Symptoms**:

- Real-time updates not working
- Status not updating

**Solution**:

```typescript
// Check WebSocket URL
console.log(process.env.NEXT_PUBLIC_WS_URL);

// Add reconnection logic
const ws = new WebSocket(url);
ws.onclose = () => {
  setTimeout(() => reconnect(), 3000);
};
```

#### CORS errors

**Symptoms**:

```
Access to XMLHttpRequest at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**:

```python
# Check CORS settings in backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### PWA/Mobile Browser Issues

#### Camera permission denied

**Symptoms**:

- Camera not opening
- Permission error
- "NotAllowedError" in console

**Solution**:

- Ensure you are using HTTPS or localhost (camera requires secure context)
- Check browser permissions for the site
- On iOS, ensure Safari has camera access in Settings
- Check if another app is using the camera

#### Location permission denied

**Symptoms**:

- GPS not capturing
- Permission error
- "User denied Geolocation"

**Solution**:

- Check browser permissions
- Ensure "Location Services" are enabled on device
- Verify site is served over HTTPS (required for Geolocation)

#### App won't connect to API on device

**Symptoms**:

- Network errors on physical device
- Works on desktop but not mobile

**Solution**:

```bash
# Find your machine's IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Update .env
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.xxx:8000/api/v1

# Restart Customer Portal
pnpm --filter @propflow/customer-portal dev
```

Ensure your phone and computer are on the same Wi-Fi network.

---

## Test Issues

#### Tests failing unexpectedly

**Symptoms**:

- Tests pass locally but fail in CI
- Flaky tests

**Solution**:

```bash
# Clear test cache
pytest --cache-clear

# Run with verbose output
pytest -v

# Run specific test
pytest app/tests/test_properties.py::test_create_property

# Check for test pollution
pytest --forked  # Requires pytest-forked
```

#### Database fixture issues

**Symptoms**:

```
sqlalchemy.exc.OperationalError: database is locked
```

**Solution**:

```python
# Use separate database for each test
@pytest.fixture(scope="function")
def db():
    # Create fresh DB for each test
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)
```

---

## Performance Issues

### Slow API responses

**Diagnosis**:

```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8000/api/v1/properties/

# curl-format.txt:
time_namelookup:  %{time_namelookup}s\n
time_connect:  %{time_connect}s\n
time_starttransfer:  %{time_starttransfer}s\n
time_total:  %{time_total}s\n
```

**Solutions**:

1. Enable caching for read-heavy endpoints
2. Add database indexes
3. Use pagination for large lists
4. Check for N+1 query problems

### Slow database queries

**Diagnosis**:

```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 100;
SELECT pg_reload_conf();

-- Find slow queries
SELECT query, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

**Solutions**:

```sql
-- Add indexes
CREATE INDEX idx_property_status ON property(status);
CREATE INDEX idx_property_user_id ON property(user_id);

-- Analyze query plan
EXPLAIN ANALYZE SELECT * FROM property WHERE status = 'SUBMITTED';
```

### Memory issues

**Symptoms**:

- Container crashes
- OOM killed

**Solution**:

```bash
# Check memory usage
docker stats

# Increase container memory
# In docker-compose.yml:
services:
  api:
    deploy:
      resources:
        limits:
          memory: 1G
```

---

## Recovery Procedures

### Reset Development Environment

```bash
# Stop everything
docker-compose down -v

# Remove volumes
docker volume rm propflow_postgres_data propflow_redis_data propflow_minio_data

# Clean build cache
rm -rf backend/__pycache__ backend/.pytest_cache
rm -rf frontend/node_modules frontend/.next

# Rebuild
docker-compose build --no-cache
docker-compose up -d

# Reinstall dependencies
pnpm install
cd backend && pip install -r requirements.txt
```

### Reset Database

```bash
# Drop and recreate
docker-compose exec db psql -U postgres -c "DROP DATABASE propflow;"
docker-compose exec db psql -U postgres -c "CREATE DATABASE propflow;"

# Run migrations
cd backend
alembic upgrade head
```

### Clear Redis Cache

```bash
# Clear all
docker-compose exec redis redis-cli FLUSHALL

# Clear specific pattern
docker-compose exec redis redis-cli --eval clear_pattern.lua , "otp:*"
```

---

## Getting Help

### Before Asking

1. Check this troubleshooting guide
2. Search existing issues in the repository
3. Check relevant logs
4. Try to reproduce the issue

### When Asking

Provide:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Relevant logs
- Environment details (OS, Node version, Python version)

### Useful Debug Commands

```bash
# System info
node --version
python --version
pnpm --version
docker --version

# Check ports
lsof -i :8000
lsof -i :5432
lsof -i :6379
lsof -i :3000

# Check processes
ps aux | grep uvicorn
ps aux | grep node

# Network diagnostics
curl -v http://localhost:8000/health
ping localhost
```
