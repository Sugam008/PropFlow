from app.crud.base import CRUDBase
from app.models.comp import Comparable
from app.schemas.comp import ComparableCreate, ComparableUpdate


class CRUDComparable(CRUDBase[Comparable, ComparableCreate, ComparableUpdate]):
    pass


comp = CRUDComparable(Comparable)
