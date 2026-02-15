# PropFlow Backend

FastAPI-based backend for the PropFlow Property Valuation and Workflow Automation platform.

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Local Server**:
   ```bash
   uvicorn app.main:app --reload
   ```

## Key Features

- **FastAPI**: Modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
- **SQLAlchemy 2.0**: Database toolkit and Object-Relational Mapper.
- **Alembic**: Database migrations.
- **Celery**: Distributed Task Queue for background jobs.
- **Structured Logging**: JSON-formatted logs for production monitoring.
- **Health Checks**: Deep health checks for database and cache availability.

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Health Monitoring

The backend provides a `/health` endpoint that performs deep connectivity checks:

- **Database**: Verifies connectivity to PostgreSQL.
- **Redis**: Verifies connectivity to the Redis cache/broker.

Returns `200 OK` if all services are healthy, or `503 Service Unavailable` with a detailed report if any dependency is failing.
