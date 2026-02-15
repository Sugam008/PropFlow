import uuid
from io import BytesIO
from unittest.mock import patch

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.schemas.user import UserCreate


def test_upload_photo(client: TestClient, db: Session) -> None:
    # Create user
    phone = f"+1{str(uuid.uuid4().int)[:10]}"
    user_in = UserCreate(phone=phone, name="Photo Owner", password="password")
    crud.user.create(db, obj_in=user_in)

    # Login
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": phone, "password": "password"},
    )
    token = response.json()["access_token"]

    # Create property
    property_data = {
        "property_type": "HOUSE",
        "address": "456 Photo St",
        "city": "Photo City",
        "state": "Photo State",
        "pincode": "654321",
        "area_sqft": 2000.0,
        "bedrooms": 4,
        "bathrooms": 3,
        "description": "A house for photos"
    }
    response = client.post(
        f"{settings.API_V1_STR}/properties/",
        json=property_data,
        headers={"Authorization": f"Bearer {token}"},
    )
    property_id = response.json()["id"]

    # Mock storage upload
    with patch("app.core.storage.storage_service.upload_file") as mock_upload:
        mock_upload.return_value = "https://mock-s3.com/photo.jpg"

        # Upload photo
        file_content = b"fake photo data"
        file = {"file": ("test.jpg", BytesIO(file_content), "image/jpeg")}

        response = client.post(
            f"{settings.API_V1_STR}/properties/{property_id}/photos",
            files=file,
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["property_id"] == property_id
        assert data["s3_url"] == "https://mock-s3.com/photo.jpg"
        mock_upload.assert_called_once()

def test_get_property_photos(client: TestClient, db: Session) -> None:
    # Create user
    phone = f"+1{str(uuid.uuid4().int)[:10]}"
    user_in = UserCreate(phone=phone, name="Photo Viewer", password="password")
    crud.user.create(db, obj_in=user_in)

    # Login
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": phone, "password": "password"},
    )
    token = response.json()["access_token"]

    # Create property
    property_data = {
        "property_type": "HOUSE",
        "address": "789 View St",
        "city": "View City",
        "state": "View State",
        "pincode": "111222",
        "area_sqft": 1000.0,
    }
    response = client.post(
        f"{settings.API_V1_STR}/properties/",
        json=property_data,
        headers={"Authorization": f"Bearer {token}"},
    )
    property_id = response.json()["id"]

    # Upload photo
    with patch("app.core.storage.storage_service.upload_file") as mock_upload:
        mock_upload.return_value = "https://mock-s3.com/photo.jpg"
        file = {"file": ("test.jpg", BytesIO(b"data"), "image/jpeg")}
        client.post(
            f"{settings.API_V1_STR}/properties/{property_id}/photos",
            files=file,
            headers={"Authorization": f"Bearer {token}"},
        )

    # Get photos
    response = client.get(
        f"{settings.API_V1_STR}/properties/{property_id}/photos",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["property_id"] == property_id

def test_delete_photo(client: TestClient, db: Session) -> None:
    # Create user
    phone = f"+1{str(uuid.uuid4().int)[:10]}"
    user_in = UserCreate(phone=phone, name="Photo Deleter", password="password")
    crud.user.create(db, obj_in=user_in)

    # Login
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": phone, "password": "password"},
    )
    token = response.json()["access_token"]

    # Create property
    property_data = {
        "property_type": "HOUSE",
        "address": "321 Delete St",
        "city": "Delete City",
        "state": "Delete State",
        "pincode": "333444",
        "area_sqft": 1200.0,
    }
    response = client.post(
        f"{settings.API_V1_STR}/properties/",
        json=property_data,
        headers={"Authorization": f"Bearer {token}"},
    )
    property_id = response.json()["id"]

    # Upload photo
    with patch("app.core.storage.storage_service.upload_file") as mock_upload:
        mock_upload.return_value = "https://mock-s3.com/photo.jpg"
        file = {"file": ("test.jpg", BytesIO(b"data"), "image/jpeg")}
        resp = client.post(
            f"{settings.API_V1_STR}/properties/{property_id}/photos",
            files=file,
            headers={"Authorization": f"Bearer {token}"},
        )
        photo_id = resp.json()["id"]

    # Delete photo
    response = client.delete(
        f"{settings.API_V1_STR}/properties/photos/{photo_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200

    # Verify deleted
    response = client.get(
        f"{settings.API_V1_STR}/properties/{property_id}/photos",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert len(response.json()) == 0
