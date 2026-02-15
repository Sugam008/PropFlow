import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import JSON, DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import GUID, Base


class AuditLog(Base):
    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    entity_type: Mapped[str] = mapped_column(
        String, nullable=False, index=True
    )  # e.g., 'property', 'user'
    entity_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), nullable=False, index=True
    )
    action: Mapped[str] = mapped_column(String, nullable=False)
    old_value: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    new_value: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    actor_id: Mapped[uuid.UUID | None] = mapped_column(
        GUID(), ForeignKey("user.id"), nullable=True
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
