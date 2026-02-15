import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.utils.cache import cache_response, invalidate_cache

router = APIRouter()


@router.get("/", response_model=list[schemas.Property])
@cache_response(expire=300, key_prefix="properties")
def read_properties(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve properties.
    """
    if current_user.role == models.UserRole.ADMIN:
        properties = crud.property.get_multi(db, skip=skip, limit=limit)
    elif current_user.role == models.UserRole.VALUER:
        properties = crud.property.get_pending_review(db, skip=skip, limit=limit)
    else:
        properties = crud.property.get_multi_by_owner(
            db, user_id=current_user.id, skip=skip, limit=limit
        )
    return properties


@router.post("/", response_model=schemas.Property)
def create_property(
    *,
    db: Session = Depends(deps.get_db),
    property_in: schemas.PropertyCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new property.
    """
    invalidate_cache("properties:*")
    return crud.property.create_with_owner(
        db, obj_in=property_in, user_id=current_user.id
    )


@router.put("/{id}", response_model=schemas.Property)
def update_property(
    *,
    db: Session = Depends(deps.get_db),
    id: uuid.UUID,
    property_in: schemas.PropertyUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a property.
    """
    property_obj = crud.property.get(db, id=id)
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    if (
        property_obj.user_id != current_user.id
        and current_user.role != models.UserRole.ADMIN
    ):
        raise HTTPException(status_code=400, detail="Not enough permissions")

    invalidate_cache("properties:*")
    return crud.property.update(db, db_obj=property_obj, obj_in=property_in)


@router.get("/{id}", response_model=schemas.Property)
@cache_response(expire=300, key_prefix="properties")
def read_property(
    *,
    db: Session = Depends(deps.get_db),
    id: uuid.UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get property by ID.
    """
    property_obj = crud.property.get(db, id=id)
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    if (
        property_obj.user_id != current_user.id
        and current_user.role not in [models.UserRole.ADMIN, models.UserRole.VALUER]
    ):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return property_obj


@router.delete("/{id}", response_model=schemas.Property)
def delete_property(
    *,
    db: Session = Depends(deps.get_db),
    id: uuid.UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a property.
    """
    property_obj = crud.property.get(db, id=id)
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    if (
        property_obj.user_id != current_user.id
        and current_user.role != models.UserRole.ADMIN
    ):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    invalidate_cache("properties:*")
    return crud.property.remove(db, id=id)


@router.post("/{id}/submit", response_model=schemas.Property)
def submit_property(
    *,
    db: Session = Depends(deps.get_db),
    id: uuid.UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Submit a property for review.
    """
    property_obj = crud.property.get(db, id=id)
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    if (
        property_obj.user_id != current_user.id
        and current_user.role != models.UserRole.ADMIN
    ):
        raise HTTPException(status_code=400, detail="Not enough permissions")
    if property_obj.status != models.PropertyStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Property is not in draft status")

    # Ensure there are photos before submission
    if not property_obj.photos:
        raise HTTPException(
            status_code=400, detail="Property must have photos before submission"
        )

    invalidate_cache("properties:*")
    return crud.property.submit(db, db_obj=property_obj)
