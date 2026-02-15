import uuid

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.photo import PropertyPhoto
from app.schemas.photo import PropertyPhotoCreate, PropertyPhotoUpdate


class CRUDPhoto(CRUDBase[PropertyPhoto, PropertyPhotoCreate, PropertyPhotoUpdate]):
    def get_by_property(
        self, db: Session, *, property_id: uuid.UUID
    ) -> list[PropertyPhoto]:
        return (
            db.query(self.model)
            .filter(PropertyPhoto.property_id == property_id)
            .order_by(PropertyPhoto.sequence)
            .all()
        )

    def create_with_property(
        self, db: Session, *, obj_in: PropertyPhotoCreate
    ) -> PropertyPhoto:
        db_obj = self.model(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


photo = CRUDPhoto(PropertyPhoto)
