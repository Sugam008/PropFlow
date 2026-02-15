import uuid
from datetime import UTC, datetime

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.property import Property, PropertyStatus
from app.schemas.property import PropertyCreate, PropertyUpdate


class CRUDProperty(CRUDBase[Property, PropertyCreate, PropertyUpdate]):
    def get_multi_by_owner(
        self, db: Session, *, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> list[Property]:
        return (
            db.query(self.model)
            .filter(Property.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_pending_review(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> list[Property]:
        # For demo: return all properties regardless of status
        return db.query(self.model).offset(skip).limit(limit).all()

    def create_with_owner(
        self, db: Session, *, obj_in: PropertyCreate, user_id: uuid.UUID
    ) -> Property:
        obj_in_data = obj_in.model_dump()
        db_obj = self.model(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def submit(self, db: Session, *, db_obj: Property) -> Property:
        db_obj.status = PropertyStatus.SUBMITTED
        db_obj.submitted_at = datetime.now(UTC)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


property = CRUDProperty(Property)
