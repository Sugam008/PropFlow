import uuid

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.property import Property, PropertyStatus
from app.models.valuation import Valuation
from app.schemas.valuation import ValuationCreate, ValuationUpdate


class CRUDValuation(CRUDBase[Valuation, ValuationCreate, ValuationUpdate]):
    def create_with_property_update(
        self, db: Session, *, obj_in: ValuationCreate, valuer_id: uuid.UUID
    ) -> Valuation:
        # Create valuation
        db_obj = self.model(
            **obj_in.model_dump(),
            valuer_id=valuer_id,
        )
        db.add(db_obj)

        # Update property
        property_obj = (
            db.query(Property).filter(Property.id == obj_in.property_id).first()
        )
        if property_obj:
            property_obj.status = PropertyStatus.VALUED
            property_obj.estimated_value = obj_in.estimated_value
            property_obj.valuer_id = valuer_id
            property_obj.reviewed_at = obj_in.valuation_date
            db.add(property_obj)

        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_valuer(
        self, db: Session, *, valuer_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> list[Valuation]:
        return (
            db.query(self.model)
            .filter(Valuation.valuer_id == valuer_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_owner(
        self, db: Session, *, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> list[Valuation]:
        return (
            db.query(self.model)
            .join(Property)
            .filter(Property.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )


valuation = CRUDValuation(Valuation)
