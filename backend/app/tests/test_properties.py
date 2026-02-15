import uuid

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.models.property import PropertyType
from app.schemas.property import PropertyCreate
from app.schemas.user import UserCreate


def test_create_property(client: TestClient, db: Session) -> None:
    # Create user
    phone = f"+1{str(uuid.uuid4().int)[:10]}"
    user_in = UserCreate(phone=phone, name="Property Owner", password="password")
    user = crud.user.create(db, obj_in=user_in)

    # Login
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": phone, "password": "password"},
    )
    token = response.json()["access_token"]

    # Create property
    property_data = {
        "property_type": "HOUSE",
        "address": "123 Test St",
        "city": "Test City",
        "state": "Test State",
        "pincode": "123456",
        "area_sqft": 1500.0,
        "bedrooms": 3,
        "bathrooms": 2,
        "description": "A nice test house",
    }
    response = client.post(
        f"{settings.API_V1_STR}/properties/",
        json=property_data,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["address"] == "123 Test St"
    assert data["user_id"] == str(user.id)


def test_read_properties_owner(client: TestClient, db: Session) -> None:
    # Create user
    phone = f"+1{str(uuid.uuid4().int)[:10]}"
    user_in = UserCreate(phone=phone, name="Property Owner", password="password")
    user = crud.user.create(db, obj_in=user_in)

    # Create 2 properties for this user
    for i in range(2):
        property_in = PropertyCreate(
            property_type=PropertyType.HOUSE,
            address=f"Address {i}",
            city="City",
            state="State",
            pincode="123456",
            area_sqft=1000.0,
        )
        crud.property.create_with_owner(db, obj_in=property_in, user_id=user.id)

    # Login
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": phone, "password": "password"},
    )
    token = response.json()["access_token"]

    # Read properties
    response = client.get(
        f"{settings.API_V1_STR}/properties/",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_read_property_permissions(client: TestClient, db: Session) -> None:
    # Create two users
    phone1 = f"+1{str(uuid.uuid4().int)[:10]}"
    user1 = crud.user.create(
        db,
        obj_in=UserCreate(phone=phone1, name="User 1", password="password"),
    )

    phone2 = f"+1{str(uuid.uuid4().int)[:10]}"
    crud.user.create(
        db,
        obj_in=UserCreate(phone=phone2, name="User 2", password="password"),
    )

    # User 1 creates a property
    property_in = PropertyCreate(
        property_type=PropertyType.HOUSE,
        address="User 1 Property",
        city="City",
        state="State",
        pincode="123456",
        area_sqft=1000.0,
    )
    prop = crud.property.create_with_owner(db, obj_in=property_in, user_id=user1.id)

    # Login as User 2
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": phone2, "password": "password"},
    )
    token2 = response.json()["access_token"]

    # Try to read User 1's property as User 2
    response = client.get(
        f"{settings.API_V1_STR}/properties/{prop.id}",
        headers={"Authorization": f"Bearer {token2}"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Not enough permissions"


def test_read_properties_admin_valuer(client: TestClient, db: Session) -> None:
    from app.models.user import UserRole

    # Create a property
    owner_phone = f"+1{str(uuid.uuid4().int)[:10]}"
    owner = crud.user.create(
        db, obj_in=UserCreate(phone=owner_phone, name="Owner", password="password")
    )
    property_in = PropertyCreate(
        property_type=PropertyType.HOUSE,
        address="Admin Test Property",
        city="City",
        state="State",
        pincode="123456",
        area_sqft=1000.0,
    )
    prop = crud.property.create_with_owner(db, obj_in=property_in, user_id=owner.id)
    crud.property.submit(db, db_obj=prop)

    # Create Admin
    admin_phone = f"+1{str(uuid.uuid4().int)[:10]}"
    crud.user.create(
        db,
        obj_in=UserCreate(
            phone=admin_phone, name="Admin", password="password", role=UserRole.ADMIN
        ),
    )

    # Create Valuer
    valuer_phone = f"+1{str(uuid.uuid4().int)[:10]}"
    crud.user.create(
        db,
        obj_in=UserCreate(
            phone=valuer_phone, name="Valuer", password="password", role=UserRole.VALUER
        ),
    )

    # Login as Admin
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": admin_phone, "password": "password"},
    )
    admin_token = response.json()["access_token"]

    # Admin should see all properties
    response = client.get(
        f"{settings.API_V1_STR}/properties/",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    assert len(response.json()) >= 1

    # Login as Valuer
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": valuer_phone, "password": "password"},
    )
    valuer_token = response.json()["access_token"]

    # Valuer should see pending properties
    response = client.get(
        f"{settings.API_V1_STR}/properties/",
        headers={"Authorization": f"Bearer {valuer_token}"},
    )
    assert response.status_code == 200
    # Note: Depending on existing data, this might be 1 or more
    assert len(response.json()) >= 1
