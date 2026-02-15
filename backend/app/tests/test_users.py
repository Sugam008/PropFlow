from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.models.user import UserRole
from app.schemas.user import UserCreate


def test_read_user_me(client: TestClient, db: Session) -> None:
    phone = "+12223334444"
    user_in = UserCreate(phone=phone, name="Test User", password="password")
    crud.user.create(db, obj_in=user_in)

    # Login to get token
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": phone, "password": "password"},
    )
    assert response.status_code == 200
    token = response.json()["access_token"]

    # Read /users/me
    response = client.get(
        f"{settings.API_V1_STR}/users/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["phone"] == phone
    assert data["name"] == "Test User"

def test_read_users_admin(client: TestClient, db: Session) -> None:
    # Create an admin user
    phone = "+18889990000"
    user_in = UserCreate(
        phone=phone,
        name="Admin User",
        password="password",
        role=UserRole.ADMIN,
    )
    crud.user.create(db, obj_in=user_in)

    # Login as admin
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": phone, "password": "password"},
    )
    token = response.json()["access_token"]

    # List users
    response = client.get(
        f"{settings.API_V1_STR}/users/",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(u["phone"] == phone for u in data)

def test_read_users_normal_user_denied(client: TestClient, db: Session) -> None:
    # Create a normal user
    phone = "+17776665555"
    user_in = UserCreate(
        phone=phone,
        name="Normal User",
        password="password",
        role=UserRole.CUSTOMER,
    )
    crud.user.create(db, obj_in=user_in)

    # Login as normal user
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": phone, "password": "password"},
    )
    token = response.json()["access_token"]

    # List users (should be denied)
    response = client.get(
        f"{settings.API_V1_STR}/users/",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "The user doesn't have enough privileges"
