import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=list[schemas.Valuation])
def read_valuations(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve valuations.
    """
    if current_user.role == models.UserRole.ADMIN:
        valuations = db.query(models.Valuation).offset(skip).limit(limit).all()
    elif current_user.role == models.UserRole.VALUER:
        valuations = (
            db.query(models.Valuation)
            .filter(models.Valuation.valuer_id == current_user.id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    else:
        # Regular users see valuations for their properties
        valuations = (
            db.query(models.Valuation)
            .join(models.Property)
            .filter(models.Property.user_id == current_user.id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    return valuations


@router.post("/", response_model=schemas.Valuation)
async def create_valuation(
    *,
    db: Session = Depends(deps.get_db),
    valuation_in: schemas.ValuationCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new valuation.
    """
    if current_user.role not in [models.UserRole.ADMIN, models.UserRole.VALUER]:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    property_obj = (
        db.query(models.Property)
        .filter(models.Property.id == valuation_in.property_id)
        .first()
    )
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")

    valuation_obj = models.Valuation(
        **valuation_in.model_dump(),
        valuer_id=current_user.id,
    )

    # Update property status and estimated value
    property_obj.status = models.PropertyStatus.VALUED
    property_obj.estimated_value = valuation_in.estimated_value
    property_obj.valuer_id = current_user.id
    property_obj.reviewed_at = valuation_obj.valuation_date

    db.add(valuation_obj)
    db.add(property_obj)
    db.commit()
    db.refresh(valuation_obj)

    # Notify property owner via WebSocket
    from app.schemas.valuation import Valuation as ValuationSchema
    from app.websocket.connection import manager

    try:
        valuation_data = ValuationSchema.model_validate(valuation_obj).model_dump(
            mode="json"
        )
        await manager.send_to_user(
            str(property_obj.user_id),
            {
                "type": "VALUATION_COMPLETED",
                "data": valuation_data,
            },
        )
    except Exception:
        # WebSocket notification is best-effort
        pass

    return valuation_obj


@router.get("/{id}", response_model=schemas.Valuation)
def read_valuation(
    *,
    db: Session = Depends(deps.get_db),
    id: uuid.UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get valuation by ID.
    """
    valuation_obj = db.query(models.Valuation).filter(models.Valuation.id == id).first()
    if not valuation_obj:
        raise HTTPException(status_code=404, detail="Valuation not found")

    property_obj = valuation_obj.property
    if (
        current_user.role not in [models.UserRole.ADMIN, models.UserRole.VALUER]
        and property_obj.user_id != current_user.id
    ):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    return valuation_obj
