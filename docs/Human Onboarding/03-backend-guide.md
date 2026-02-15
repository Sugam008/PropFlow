# Backend Development Guide

This guide covers backend development for PropFlow, built with FastAPI and Python 3.11.

## Technology Stack

| Component    | Technology  | Version |
| ------------ | ----------- | ------- |
| Framework    | FastAPI     | Latest  |
| Runtime      | Python      | 3.11    |
| ORM          | SQLAlchemy  | 2.0     |
| Database     | PostgreSQL  | 16      |
| Migrations   | Alembic     | Latest  |
| Cache/Broker | Redis       | 7       |
| Task Queue   | Celery      | Latest  |
| Storage      | MinIO/S3    | Latest  |
| Auth         | python-jose | Latest  |
| Validation   | Pydantic    | 2.x     |
| Testing      | Pytest      | Latest  |

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry
│   ├── database.py          # SQLAlchemy setup
│   ├── api/
│   │   ├── deps.py          # Dependencies (auth, DB)
│   │   └── v1/
│   │       ├── api.py       # Route aggregation
│   │       └── endpoints/   # Route handlers
│   ├── models/              # SQLAlchemy ORM models
│   ├── schemas/             # Pydantic schemas
│   ├── services/            # Business logic
│   ├── crud/                # Database operations
│   ├── tasks/               # Celery tasks
│   ├── core/                # Config, security, logging
│   ├── websocket/           # WebSocket handlers
│   └── tests/               # Test suite
├── alembic/                 # Database migrations
├── requirements.txt         # Python dependencies
└── Dockerfile               # Container definition
```

---

## Key Files Explained

### Entry Point: `app/main.py`

```python
from fastapi import FastAPI
from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Middleware setup
app.add_middleware(...)  # CORS, security headers

# Include routers
app.include_router(api_router, prefix=settings.API_V1_STR)

# Health check endpoint
@app.get("/health")
async def health_check(): ...
```

### Database Setup: `app/database.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Configuration: `app/core/config.py`

Uses Pydantic BaseSettings for environment-based configuration:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PropFlow"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    DATABASE_URL: str
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## API Development

### Creating a New Endpoint

1. **Define Schema** (`app/schemas/property.py`):

```python
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class PropertyBase(BaseModel):
    property_type: PropertyType
    address: str
    area_sqft: float

class PropertyCreate(PropertyBase):
    pass

class PropertyInDB(PropertyBase):
    id: UUID
    user_id: UUID
    status: PropertyStatus
    created_at: datetime

    class Config:
        from_attributes = True
```

2. **Define CRUD** (`app/crud/property.py`):

```python
from sqlalchemy.orm import Session
from app.models.property import Property
from app.schemas.property import PropertyCreate

def create_property(db: Session, *, obj_in: PropertyCreate, user_id: UUID) -> Property:
    db_obj = Property(
        **obj_in.model_dump(),
        user_id=user_id,
        status=PropertyStatus.DRAFT
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
```

3. **Create Endpoint** (`app/api/v1/endpoints/properties.py`):

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.schemas.property import PropertyCreate, PropertyInDB

router = APIRouter()

@router.post("/", response_model=PropertyInDB)
def create_property(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    property_in: PropertyCreate,
):
    return crud.property.create_property(
        db, obj_in=property_in, user_id=current_user.id
    )
```

4. **Register Router** (`app/api/v1/api.py`):

```python
from app.api.v1.endpoints import properties

api_router.include_router(
    properties.router, prefix="/properties", tags=["properties"]
)
```

---

## Authentication & Authorization

### Dependencies (`app/api/deps.py`)

```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt

security = HTTPBearer()

async def get_current_user(
    token: str = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        user = crud.user.get(db, id=user_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_role(*roles: UserRole):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return Depends(role_checker)
```

### Using in Endpoints

```python
@router.get("/admin-only")
def admin_endpoint(
    current_user: User = Depends(require_role(UserRole.ADMIN))
):
    return {"message": "Admin access confirmed"}
```

---

## Database Models

### Model Definition (`app/models/property.py`)

```python
from sqlalchemy import Column, String, Float, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import uuid

class Property(Base):
    __tablename__ = "property"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    property_type = Column(Enum(PropertyType), nullable=False)
    address = Column(String, nullable=False)
    area_sqft = Column(Float, nullable=False)
    status = Column(Enum(PropertyStatus), default=PropertyStatus.DRAFT)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### Relationships

```python
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "user"

    id = Column(UUID(as_uuid=True), primary_key=True)
    properties = relationship("Property", back_populates="owner")

class Property(Base):
    __tablename__ = "property"

    user_id = Column(UUID, ForeignKey("user.id"))
    owner = relationship("User", back_populates="properties")
    photos = relationship("PropertyPhoto", back_populates="property")
```

---

## Database Migrations

### Creating a Migration

```bash
# After model changes
cd backend
alembic revision --autogenerate -m "Add valuation_amount to property"

# Review the generated file in alembic/versions/
```

### Applying Migrations

```bash
alembic upgrade head  # Apply all pending
alembic downgrade -1  # Rollback one migration
```

### Migration File Structure

```python
def upgrade():
    op.add_column('property', sa.Column('valuation_amount', sa.Float()))

def downgrade():
    op.drop_column('property', 'valuation_amount')
```

---

## Services Layer

### Service Pattern

Services encapsulate business logic and external integrations:

```python
# app/services/otp_service.py
from app.core.config import settings
import redis
import random

class OTPService:
    def __init__(self):
        self.redis = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)

    def generate_otp(self, phone: str) -> str:
        otp = str(random.randint(100000, 999999))
        key = f"otp:{phone}"
        self.redis.setex(key, 300, otp)  # 5 min expiry
        return otp

    def verify_otp(self, phone: str, otp: str) -> bool:
        key = f"otp:{phone}"
        stored = self.redis.get(key)
        return stored and stored.decode() == otp
```

### Using Services

```python
from app.services.otp_service import OTPService

otp_service = OTPService()

@router.post("/login/otp")
def request_otp(phone: str):
    otp = otp_service.generate_otp(phone)
    # Send OTP via SMS (stub)
    return {"message": "OTP sent"}
```

---

## Background Tasks (Celery)

### Task Definition (`app/tasks/image_processing.py`)

```python
from celery import shared_task
from app.services.image_service import ImageService

@shared_task
def process_photo(photo_id: str):
    """Process uploaded photo: extract EXIF, validate, update QC status"""
    from app.database import SessionLocal
    from app.crud.photo import get_photo, update_photo_qc

    db = SessionLocal()
    try:
        photo = get_photo(db, photo_id)
        image_service = ImageService()

        # Extract EXIF data
        exif = image_service.extract_exif(photo.s3_key)

        # Validate GPS distance
        distance = image_service.calculate_gps_distance(
            photo.property, exif.get('gps')
        )

        # Update QC status
        update_photo_qc(
            db, photo.id,
            qc_status="PASS" if distance <= 0.5 else "FAIL",
            qc_notes=f"GPS distance: {distance}km"
        )
    finally:
        db.close()
```

### Triggering Tasks

```python
from app.tasks.image_processing import process_photo

@router.post("/{property_id}/photos")
def upload_photo(property_id: UUID, file: UploadFile):
    # Save photo to S3
    photo = storage_service.upload(file)

    # Trigger background processing
    process_photo.delay(str(photo.id))

    return {"photo_id": photo.id}
```

---

## Error Handling

### Custom Exceptions (`app/core/exceptions.py`)

```python
class AppError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

class RateLimitError(AppError):
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(message, 429)
```

### Exception Handlers (`app/main.py`)

```python
@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )
```

---

## Testing

### Test Structure (`app/tests/`)

```
tests/
├── conftest.py           # Fixtures
├── test_auth.py          # Auth tests
├── test_properties.py    # Property tests
├── test_services.py      # Service tests
└── test_tasks.py         # Task tests
```

### Test Fixtures (`conftest.py`)

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.main import app
from fastapi.testclient import TestClient

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

@pytest.fixture(scope="session")
def db():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db):
    def override_get_db():
        yield db
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()
```

### Writing Tests

```python
def test_create_property(client, db):
    # Create and authenticate user
    user = crud.user.create(db, obj_in=UserCreate(phone="+911234567890"))
    token = create_access_token(user.id)

    # Create property
    response = client.post(
        "/api/v1/properties/",
        json={
            "property_type": "APARTMENT",
            "address": "123 Main St",
            "area_sqft": 1000
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.json()["property_type"] == "APARTMENT"
```

---

## Caching

### Redis Caching Decorator (`app/utils/cache.py`)

```python
from functools import wraps
import json
import redis

redis_client = redis.Redis()

def cache_response(expiry: int = 300):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            cached = redis_client.get(cache_key)

            if cached:
                return json.loads(cached)

            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, expiry, json.dumps(result))
            return result
        return wrapper
    return decorator
```

---

## WebSocket

### Handler (`app/websocket/handler.py`)

```python
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    async def send_to_user(self, user_id: str, message: dict):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)

manager = ConnectionManager()

@app.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    user = verify_token(token)
    await manager.connect(user.id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        del manager.active_connections[user.id]
```

---

## Environment Variables

Required environment variables (`.env`):

```bash
# Core
PROJECT_NAME=PropFlow
SECRET_KEY=your-secret-key
API_V1_STR=/api/v1

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/propflow

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Storage
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET=propflow-uploads
S3_ENDPOINT_URL=http://localhost:9000

# External (Optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
GOOGLE_VISION_API_KEY=
```

---

## Development Commands

```bash
# Start backend
cd backend
uvicorn app.main:app --reload --port 8000

# Run tests
pytest -q
pytest --cov=app

# Lint
ruff check .
ruff check . --fix

# Type check
mypy .

# Migrations
alembic revision --autogenerate -m "description"
alembic upgrade head
```

---

## Best Practices

1. **Use Pydantic schemas** for all API input/output
2. **Use dependency injection** for DB sessions and auth
3. **Keep endpoints thin** - delegate to services
4. **Use async** for I/O operations
5. **Add comprehensive tests** for all endpoints
6. **Use background tasks** for heavy operations
7. **Cache expensive queries** with Redis
8. **Log appropriately** with structured logging
