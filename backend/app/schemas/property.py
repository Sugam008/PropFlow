import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.property import PropertyStatus, PropertyType
from app.schemas.photo import PropertyPhoto


class PropertyBase(BaseModel):
    property_type: PropertyType
    address: str
    city: str
    state: str
    pincode: str
    lat: float | None = None
    lng: float | None = None
    area_sqft: float
    bedrooms: int | None = None
    bathrooms: int | None = None
    floor: int | None = None
    total_floors: int | None = None
    age: int | None = None
    description: str | None = None


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    property_type: PropertyType | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    pincode: str | None = None
    lat: float | None = None
    lng: float | None = None
    area_sqft: float | None = None
    bedrooms: int | None = None
    bathrooms: int | None = None
    floor: int | None = None
    total_floors: int | None = None
    age: int | None = None
    description: str | None = None
    status: PropertyStatus | None = None


class Property(PropertyBase):
    id: uuid.UUID
    user_id: uuid.UUID
    status: PropertyStatus
    submitted_at: datetime | None = None
    reviewed_at: datetime | None = None
    estimated_value: float | None = None
    valuer_notes: str | None = None
    valuer_id: uuid.UUID | None = None
    created_at: datetime
    updated_at: datetime | None = None
    photos: list[PropertyPhoto] = []

    model_config = ConfigDict(from_attributes=True)
