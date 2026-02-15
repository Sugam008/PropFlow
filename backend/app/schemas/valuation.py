import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.comp import Comparable


class ValuationBase(BaseModel):
    property_id: uuid.UUID
    estimated_value: float
    confidence_score: float
    valuation_date: datetime
    methodology: str = "comparative"
    notes: str | None = None


class ValuationCreate(ValuationBase):
    comp1_id: uuid.UUID | None = None
    comp2_id: uuid.UUID | None = None
    comp3_id: uuid.UUID | None = None


class ValuationUpdate(BaseModel):
    estimated_value: float | None = None
    confidence_score: float | None = None
    valuation_date: datetime | None = None
    methodology: str | None = None
    notes: str | None = None
    comp1_id: uuid.UUID | None = None
    comp2_id: uuid.UUID | None = None
    comp3_id: uuid.UUID | None = None


class Valuation(ValuationBase):
    id: uuid.UUID
    valuer_id: uuid.UUID
    created_at: datetime
    comp1: Comparable | None = None
    comp2: Comparable | None = None
    comp3: Comparable | None = None

    model_config = ConfigDict(from_attributes=True)
