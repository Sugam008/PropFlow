# For tests, we'll use a local PostgreSQL database if possible,
# or stick to SQLite but we need to fix the UUID compatibility.
# Since we are in a sandbox and might not have PostgreSQL,
# let's try to use a mock for the database if SQLite fails on UUID.
# Actually, the best way for SQLite is to use a GUID type that maps to String.
import uuid
from collections.abc import Generator
from typing import Any

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.types import CHAR, TypeDecorator

from app.api.deps import get_db
from app.database import Base
from app.main import app


class GUID(TypeDecorator[uuid.UUID]):
    """Platform-independent GUID type.
    Uses PostgreSQL's UUID type, otherwise uses
    CHAR(32), storing as stringified hex values.
    """
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect: Any) -> Any:
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID())
        else:
            return dialect.type_descriptor(CHAR(32))

    def process_bind_param(self, value: Any, dialect: Any) -> Any:
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return f"{uuid.UUID(value).int:032x}"
            else:
                return f"{value.int:032x}"

    def process_result_value(self, value: Any, dialect: Any) -> Any:
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                return uuid.UUID(value)
            else:
                return value

# Use a separate test database or an in-memory one
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def db() -> Generator[Session, None, None]:
    # This is a hack to make SQLite work with PG's UUID type in tests
    # In a real app, you'd use a better migration/model strategy
    from sqlalchemy.dialects.postgresql import UUID

    # Monkeypatch UUID to work with SQLite for tests
    def _sqlite_uuid_compiler(type_: Any, dialect: Any, **kw: Any) -> str:
        return "CHAR(32)"

    from sqlalchemy.ext.compiler import compiles
    compiles(UUID, "sqlite")(_sqlite_uuid_compiler)  # type: ignore

    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="module")
def client(db: Session) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
