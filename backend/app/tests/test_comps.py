import uuid
from datetime import datetime

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.models.user import UserRole
from app.schemas.user import UserCreate


def test_create_comp(client: TestClient, db: Session) -> None:
    # Create valuer
    valuer_phone = f"+1{str(uuid.uuid4().int)[:10]}"
    valuer_in = UserCreate(
        phone=valuer_phone,
        name="Valuer Comp",
        password="password",
        role=UserRole.VALUER,
    )
    crud.user.create(db, obj_in=valuer_in)

    # Login as valuer
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": valuer_phone, "password": "password"},
    )
    token = response.json()["access_token"]

    # Create comp
    comp_data = {
        "address": "555 Comp St",
        "city": "Comp City",
        "state": "Comp State",
        "pincode": "555666",
        "area_sqft": 1500.0,
        "sale_price": 4500000.0,
        "sale_date": datetime.now().isoformat(),
        "distance_km": 0.5,
        "description": "Similar house nearby"
    }
    response = client.post(
        f"{settings.API_V1_STR}/comps/",
        json=comp_data,
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["address"] == "555 Comp St"
    assert data["sale_price"] == 4500000.0

def test_read_comps(client: TestClient, db: Session) -> None:
    # Login
    phone = f"+1{str(uuid.uuid4().int)[:10]}"
    user_in = UserCreate(phone=phone, name="Comp Viewer", password="password")
    crud.user.create(db, obj_in=user_in)

    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": phone, "password": "password"},
    )
    token = response.json()["access_token"]

    # Get comps
    response = client.get(
        f"{settings.API_V1_STR}/comps/",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_comp(client: TestClient, db: Session) -> None:
    # Create valuer
    valuer_phone = f"+1{str(uuid.uuid4().int)[:10]}"
    valuer_in = UserCreate(
        phone=valuer_phone,
        name="Valuer Comp Update",
        password="password",
        role=UserRole.VALUER,
    )
    crud.user.create(db, obj_in=valuer_in)

    # Login
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": valuer_phone, "password": "password"},
    )
    token = response.json()["access_token"]

    # Create comp
    comp_data = {
        "address": "666 Update St",
        "city": "Update City",
        "state": "Update State",
        "pincode": "777888",
        "area_sqft": 1000.0,
        "sale_price": 3000000.0,
        "sale_date": datetime.now().isoformat(),
    }
    resp = client.post(
        f"{settings.API_V1_STR}/comps/",
        json=comp_data,
        headers={"Authorization": f"Bearer {token}"},
    )
    comp_id = resp.json()["id"]

    # Update comp
    update_data = {"sale_price": 3100000.0}
    response = client.put(
        f"{settings.API_V1_STR}/comps/{comp_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["sale_price"] == 3100000.0
