import uuid
from collections.abc import Generator
from typing import Any
from unittest.mock import patch

import pytest
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.models.photo import QCStatus
from app.tasks.image_processing import process_photo


@pytest.fixture
def mock_image_service() -> Generator[Any, None, None]:
    with patch("app.tasks.image_processing.image_service") as mock:
        yield mock

def test_process_photo_success(db: Session, mock_image_service: Any) -> None:
    # 1. Create a user and property
    phone = f"+1{str(uuid.uuid4().int)[:10]}"
    user_in = schemas.UserCreate(phone=phone, name="Task User", password="password")
    user = crud.user.create(db, obj_in=user_in)

    prop_in = schemas.PropertyCreate(
        address="123 Task St",
        city="Task City",
        state="TS",
        pincode="12345",
        property_type=models.PropertyType.HOUSE,
        area_sqft=1500.0,
    )
    prop = crud.property.create_with_owner(db, obj_in=prop_in, user_id=user.id)

    # 2. Create a photo record
    photo_in = schemas.PropertyPhotoCreate(
        property_id=prop.id,
        s3_key="test_key.jpg",
        s3_url="http://mock-s3/test_key.jpg",
        photo_type=models.PhotoType.EXTERIOR,
    )
    photo = crud.photo.create_with_property(db, obj_in=photo_in)
    assert photo.qc_status == QCStatus.PENDING

    # 3. Mock image service results
    from datetime import UTC, datetime

    mock_image_service.get_exif_data.return_value = {
        "captured_at": datetime.now(UTC),
        "device_model": "iPhone 15",
        "gps_lat": 12.34,
        "gps_lng": 56.78,
    }
    mock_image_service.perform_qc_checks.return_value = {
        "is_blurry": False,
        "is_too_dark": False,
        "is_too_bright": False,
        "blur_score": 50.0,
        "brightness_score": 120.0,
    }

    # 4. Run the task (synchronously for testing)
    with patch("app.tasks.image_processing.SessionLocal", return_value=db):
        result = process_photo(str(photo.id), photo.s3_url)

    # 5. Verify results
    assert result["status"] == "completed"

    # Re-fetch from DB since task closed its own session
    db.expire_all()
    photo_db = crud.photo.get(db, id=photo.id)
    assert photo_db is not None
    assert photo_db.qc_status == QCStatus.APPROVED
    assert photo_db.device_model == "iPhone 15"
    assert photo_db.gps_lat == 12.34
    assert photo_db.gps_lng == 56.78
    assert photo_db.qc_notes is not None
    assert "QC results" in photo_db.qc_notes

def test_process_photo_failure_qc(db: Session, mock_image_service: Any) -> None:
    # 1. Create a user and property
    phone = f"+1{str(uuid.uuid4().int)[:10]}"
    user_in = schemas.UserCreate(
        phone=phone,
        name="Task User Fail",
        password="password",
    )
    user = crud.user.create(db, obj_in=user_in)

    prop_in = schemas.PropertyCreate(
        address="456 Fail St",
        city="Fail City",
        state="TS",
        pincode="54321",
        property_type=models.PropertyType.HOUSE,
        area_sqft=2000.0,
    )
    prop = crud.property.create_with_owner(db, obj_in=prop_in, user_id=user.id)

    # 2. Create a photo record
    photo_in = schemas.PropertyPhotoCreate(
        property_id=prop.id,
        s3_key="fail_key.jpg",
        s3_url="http://mock-s3/fail_key.jpg",
        photo_type=models.PhotoType.EXTERIOR,
    )
    photo = crud.photo.create_with_property(db, obj_in=photo_in)

    # 3. Mock image service results (blurry)
    mock_image_service.get_exif_data.return_value = {}
    mock_image_service.perform_qc_checks.return_value = {
        "is_blurry": True,
        "is_too_dark": False,
        "is_too_bright": False,
    }

    # 4. Run the task
    with patch("app.tasks.image_processing.SessionLocal", return_value=db):
        process_photo(str(photo.id), photo.s3_url)

    # 5. Verify results
    db.expire_all()
    photo_db = crud.photo.get(db, id=photo.id)
    assert photo_db is not None
    assert photo_db.qc_status == QCStatus.REJECTED

def test_process_photo_not_found(db: Session) -> None:
    # Run task with non-existent photo ID
    with patch("app.tasks.image_processing.SessionLocal", return_value=db):
        result = process_photo(str(uuid.uuid4()), "http://mock-s3/none.jpg")
    assert result["error"] == "Photo not found"
