import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=list[schemas.Comparable])
def read_comparables(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve comparables.
    """
    comparables = db.query(models.Comparable).offset(skip).limit(limit).all()
    return comparables


@router.post("/", response_model=schemas.Comparable)
def create_comparable(
    *,
    db: Session = Depends(deps.get_db),
    comparable_in: schemas.ComparableCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new comparable.
    """
    if current_user.role not in [models.UserRole.ADMIN, models.UserRole.VALUER]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    comparable_obj = models.Comparable(**comparable_in.model_dump())
    db.add(comparable_obj)
    db.commit()
    db.refresh(comparable_obj)
    return comparable_obj


@router.put("/{id}", response_model=schemas.Comparable)
def update_comparable(
    *,
    db: Session = Depends(deps.get_db),
    id: uuid.UUID,
    comparable_in: schemas.ComparableUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a comparable.
    """
    if current_user.role not in [models.UserRole.ADMIN, models.UserRole.VALUER]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    comparable_obj = (
        db.query(models.Comparable).filter(models.Comparable.id == id).first()
    )
    if not comparable_obj:
        raise HTTPException(status_code=404, detail="Comparable not found")

    update_data = comparable_in.model_dump(exclude_unset=True)
    for field in update_data:
        setattr(comparable_obj, field, update_data[field])

    db.add(comparable_obj)
    db.commit()
    db.refresh(comparable_obj)
    return comparable_obj


@router.get("/{id}", response_model=schemas.Comparable)
def read_comparable(
    *,
    db: Session = Depends(deps.get_db),
    id: uuid.UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get comparable by ID.
    """
    comparable_obj = (
        db.query(models.Comparable).filter(models.Comparable.id == id).first()
    )
    if not comparable_obj:
        raise HTTPException(status_code=404, detail="Comparable not found")
    return comparable_obj


@router.delete("/{id}", response_model=schemas.Comparable)
def delete_comparable(
    *,
    db: Session = Depends(deps.get_db),
    id: uuid.UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a comparable.
    """
    if current_user.role != models.UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    comparable_obj = (
        db.query(models.Comparable).filter(models.Comparable.id == id).first()
    )
    if not comparable_obj:
        raise HTTPException(status_code=404, detail="Comparable not found")
    db.delete(comparable_obj)
    db.commit()
    return comparable_obj
