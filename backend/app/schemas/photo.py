import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.photo import PhotoType, QCStatus


class PropertyPhotoBase(BaseModel):
    photo_type: PhotoType = PhotoType.OTHER
    sequence: int = 0
    captured_at: datetime | None = None
    gps_lat: float | None = None
    gps_lng: float | None = None
    device_model: str | None = None


class PropertyPhotoCreate(PropertyPhotoBase):
    property_id: uuid.UUID
    s3_key: str
    s3_url: str


class PropertyPhotoUpdate(BaseModel):
    photo_type: PhotoType | None = None
    sequence: int | None = None
    qc_status: QCStatus | None = None
    qc_notes: str | None = None


class PropertyPhoto(PropertyPhotoBase):
    id: uuid.UUID
    property_id: uuid.UUID
    s3_key: str
    s3_url: str
    qc_status: QCStatus
    qc_notes: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
