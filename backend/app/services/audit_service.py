import uuid
from typing import Any

from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


class AuditService:
    @staticmethod
    def log(
        db: Session,
        *,
        entity_type: str,
        entity_id: uuid.UUID,
        action: str,
        actor_id: uuid.UUID | None = None,
        old_value: dict[str, Any] | None = None,
        new_value: dict[str, Any] | None = None,
    ) -> AuditLog:
        """Create an audit log entry."""
        db_obj = AuditLog(
            entity_type=entity_type,
            entity_id=entity_id,
            action=action,
            actor_id=actor_id,
            old_value=old_value,
            new_value=new_value,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


audit_service = AuditService()
