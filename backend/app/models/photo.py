import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import GUID, Base

if TYPE_CHECKING:
    from .property import Property


class PhotoType(str, enum.Enum):
    EXTERIOR = "EXTERIOR"
    INTERIOR = "INTERIOR"
    DOCUMENT = "DOCUMENT"
    OTHER = "OTHER"


class QCStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class PropertyPhoto(Base):
    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("property.id"), nullable=False
    )
    s3_key: Mapped[str] = mapped_column(String, nullable=False)
    s3_url: Mapped[str] = mapped_column(String, nullable=False)
    photo_type: Mapped[PhotoType] = mapped_column(
        Enum(PhotoType), default=PhotoType.OTHER, nullable=False
    )
    sequence: Mapped[int] = mapped_column(Integer, default=0)
    captured_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    gps_lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    gps_lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    device_model: Mapped[str | None] = mapped_column(String, nullable=True)
    qc_status: Mapped[QCStatus] = mapped_column(
        Enum(QCStatus), default=QCStatus.PENDING, nullable=False
    )
    qc_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    property: Mapped["Property"] = relationship("Property", back_populates="photos")
