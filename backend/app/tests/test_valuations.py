import uuid
from datetime import datetime

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.models.property import PropertyStatus
from app.models.user import UserRole
from app.schemas.user import UserCreate


def test_create_valuation(client: TestClient, db: Session) -> None:
    # 1. Create owner user
    owner_phone = f"+1{str(uuid.uuid4().int)[:10]}"
    owner_in = UserCreate(phone=owner_phone, name="Property Owner", password="password")
    crud.user.create(db, obj_in=owner_in)

    # 2. Create valuer user
    valuer_phone = f"+1{str(uuid.uuid4().int)[:10]}"
    valuer_in = UserCreate(
        phone=valuer_phone,
        name="Valuer",
        password="password",
        role=UserRole.VALUER,
    )
    valuer = crud.user.create(db, obj_in=valuer_in)

    # Login as owner to create property
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": owner_phone, "password": "password"},
    )
    owner_token = response.json()["access_token"]

    # Create property
    property_data = {
        "property_type": "HOUSE",
        "address": "101 Valuation St",
        "city": "Val City",
        "state": "Val State",
        "pincode": "999888",
        "area_sqft": 1800.0,
    }
    response = client.post(
        f"{settings.API_V1_STR}/properties/",
        json=property_data,
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    property_id = response.json()["id"]

    # Login as valuer to create valuation
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": valuer_phone, "password": "password"},
    )
    valuer_token = response.json()["access_token"]

    # Create valuation
    valuation_data = {
        "property_id": property_id,
        "estimated_value": 5000000.0,
        "confidence_score": 0.95,
        "valuation_date": datetime.now().isoformat(),
        "methodology": "comparative",
        "notes": "Good condition property",
    }
    response = client.post(
        f"{settings.API_V1_STR}/valuations/",
        json=valuation_data,
        headers={"Authorization": f"Bearer {valuer_token}"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["property_id"] == property_id
    assert data["estimated_value"] == 5000000.0
    assert data["valuer_id"] == str(valuer.id)

    # Verify property status updated
    response = client.get(
        f"{settings.API_V1_STR}/properties/{property_id}",
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    prop_data = response.json()
    assert prop_data["status"] == PropertyStatus.VALUED
    assert prop_data["estimated_value"] == 5000000.0
    assert prop_data["valuer_id"] == str(valuer.id)


def test_read_valuations(client: TestClient, db: Session) -> None:
    # 1. Create owner and property
    owner_phone = f"+1{str(uuid.uuid4().int)[:10]}"
    owner = crud.user.create(
        db, obj_in=UserCreate(phone=owner_phone, name="Owner", password="password")
    )
    property_in = {
        "property_type": "HOUSE",
        "address": "Read Val St",
        "city": "City",
        "state": "State",
        "pincode": "123456",
        "area_sqft": 1000.0,
    }

    # Login as owner
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": owner_phone, "password": "password"},
    )
    owner_token = response.json()["access_token"]

    response = client.post(
        f"{settings.API_V1_STR}/properties/",
        json=property_in,
        headers={"Authorization": f"Bearer {owner_token}"},
    )
    property_id = response.json()["id"]

    # 2. Create valuer
    valuer_phone = f"+1{str(uuid.uuid4().int)[:10]}"
    valuer = crud.user.create(
        db,
        obj_in=UserCreate(
            phone=valuer_phone, name="Valuer", password="password", role=UserRole.VALUER
        ),
    )

    # Login as valuer
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": valuer_phone, "password": "password"},
    )
    valuer_token = response.json()["access_token"]

    # 3. Create valuation
    valuation_data = {
        "property_id": property_id,
        "estimated_value": 4500000.0,
        "confidence_score": 0.9,
        "valuation_date": datetime.now().isoformat(),
        "methodology": "market",
        "notes": "Test read",
    }
    client.post(
        f"{settings.API_V1_STR}/valuations/",
        json=valuation_data,
        headers={"Authorization": f"Bearer {valuer_token}"},
    )

    # 4. Test CRUD get_by_valuer
    valuations_by_valuer = crud.valuation.get_by_valuer(db, valuer_id=valuer.id)
    assert len(valuations_by_valuer) >= 1
    assert valuations_by_valuer[0].estimated_value == 4500000.0

    # 5. Test CRUD get_by_owner
    valuations_by_owner = crud.valuation.get_by_owner(db, user_id=owner.id)
    assert len(valuations_by_owner) >= 1
    assert valuations_by_owner[0].estimated_value == 4500000.0

    # Login as valuer
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": valuer_phone, "password": "password"},
    )
    token = response.json()["access_token"]

    # Get valuations
    response = client.get(
        f"{settings.API_V1_STR}/valuations/",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)
