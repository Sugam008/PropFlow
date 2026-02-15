import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, Float, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import GUID, Base

if TYPE_CHECKING:
    from .comp import Comparable
    from .property import Property
    from .user import User


class Valuation(Base):
    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    property_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("property.id"), nullable=False
    )
    valuer_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("user.id"), nullable=False
    )
    estimated_value: Mapped[float] = mapped_column(Float, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)
    valuation_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    methodology: Mapped[str] = mapped_column(String, default="comparative")

    comp1_id: Mapped[uuid.UUID | None] = mapped_column(
        GUID(), ForeignKey("comparable.id"), nullable=True
    )
    comp2_id: Mapped[uuid.UUID | None] = mapped_column(
        GUID(), ForeignKey("comparable.id"), nullable=True
    )
    comp3_id: Mapped[uuid.UUID | None] = mapped_column(
        GUID(), ForeignKey("comparable.id"), nullable=True
    )

    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), onupdate=func.now()
    )

    property: Mapped["Property"] = relationship("Property")
    valuer: Mapped["User"] = relationship("User")
    comp1: Mapped[Optional["Comparable"]] = relationship(
        "Comparable", foreign_keys=[comp1_id]
    )
    comp2: Mapped[Optional["Comparable"]] = relationship(
        "Comparable", foreign_keys=[comp2_id]
    )
    comp3: Mapped[Optional["Comparable"]] = relationship(
        "Comparable", foreign_keys=[comp3_id]
    )
