import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ComparableBase(BaseModel):
    address: str
    city: str
    state: str
    pincode: str
    lat: float | None = None
    lng: float | None = None
    area_sqft: float
    sale_price: float
    sale_date: datetime
    distance_km: float | None = None
    source_url: str | None = None
    description: str | None = None


class ComparableCreate(ComparableBase):
    pass


class ComparableUpdate(BaseModel):
    address: str | None = None
    city: str | None = None
    state: str | None = None
    pincode: str | None = None
    lat: float | None = None
    lng: float | None = None
    area_sqft: float | None = None
    sale_price: float | None = None
    sale_date: datetime | None = None
    distance_km: float | None = None
    source_url: str | None = None
    description: str | None = None


class Comparable(ComparableBase):
    id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
