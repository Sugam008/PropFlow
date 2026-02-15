import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import GUID, Base

if TYPE_CHECKING:
    from .photo import PropertyPhoto
    from .user import User


class PropertyStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    UNDER_REVIEW = "UNDER_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    FOLLOW_UP = "FOLLOW_UP"
    VALUED = "VALUED"


class PropertyType(str, enum.Enum):
    APARTMENT = "APARTMENT"
    HOUSE = "HOUSE"
    VILLA = "VILLA"
    COMMERCIAL = "COMMERCIAL"
    LAND = "LAND"


class Property(Base):
    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("user.id"), nullable=False
    )
    property_type: Mapped[PropertyType] = mapped_column(
        Enum(PropertyType), nullable=False
    )
    address: Mapped[str] = mapped_column(String, nullable=False)
    city: Mapped[str] = mapped_column(String, nullable=False)
    state: Mapped[str] = mapped_column(String, nullable=False)
    pincode: Mapped[str] = mapped_column(String, nullable=False)
    lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    area_sqft: Mapped[float] = mapped_column(Float, nullable=False)
    bedrooms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    bathrooms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    floor: Mapped[int | None] = mapped_column(Integer, nullable=True)
    total_floors: Mapped[int | None] = mapped_column(Integer, nullable=True)
    age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[PropertyStatus] = mapped_column(
        Enum(PropertyStatus), default=PropertyStatus.DRAFT, nullable=False
    )

    submitted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    reviewed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    estimated_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    valuer_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    valuer_id: Mapped[uuid.UUID | None] = mapped_column(
        GUID(), ForeignKey("user.id"), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), onupdate=func.now()
    )

    owner: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    valuer: Mapped[Optional["User"]] = relationship("User", foreign_keys=[valuer_id])
    photos: Mapped[list["PropertyPhoto"]] = relationship(
        "PropertyPhoto", back_populates="property", cascade="all, delete-orphan"
    )
