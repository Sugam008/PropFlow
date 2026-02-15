import uuid
from typing import Any

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app import models, schemas
from app.api import deps
from app.core.storage import storage_service

router = APIRouter()

ALLOWED_IMAGE_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/heic",
    "image/heif",
    "image/webp",
}


def _validate_photo_upload(file: UploadFile) -> None:
    if file.content_type not in ALLOWED_IMAGE_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only camera image uploads are allowed.",
        )

    filename = (file.filename or "").lower()
    if "screenshot" in filename or "screen_shot" in filename:
        raise HTTPException(
            status_code=400,
            detail="Screenshot uploads are not allowed.",
        )


@router.post("/{property_id}/photos", response_model=schemas.PropertyPhoto)
async def upload_property_photo(
    *,
    db: Session = Depends(deps.get_db),
    property_id: uuid.UUID,
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload a photo for a property.
    """
    property_obj = (
        db.query(models.Property).filter(models.Property.id == property_id).first()
    )
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    if (
        property_obj.user_id != current_user.id
        and current_user.role != models.UserRole.ADMIN
    ):
        raise HTTPException(status_code=400, detail="Not enough permissions")

    _validate_photo_upload(file)

    # Upload to storage
    file_extension = file.filename.split(".")[-1] if file.filename else "jpg"
    file_key = f"properties/{property_id}/{uuid.uuid4()}.{file_extension}"

    try:
        s3_url = storage_service.upload_file(
            file.file, file_key, content_type=file.content_type
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to upload to storage: {str(e)}"
        ) from e

    # Create photo record
    photo_obj = models.PropertyPhoto(
        property_id=property_id,
        s3_key=file_key,
        s3_url=s3_url,
        photo_type=models.PhotoType.OTHER,
        sequence=len(property_obj.photos) + 1,
    )
    db.add(photo_obj)
    db.commit()
    db.refresh(photo_obj)

    # Trigger background processing
    from app.tasks.image_processing import process_photo
    process_photo.delay(str(photo_obj.id), s3_url)

    return photo_obj


@router.get("/{property_id}/photos", response_model=list[schemas.PropertyPhoto])
def read_property_photos(
    *,
    db: Session = Depends(deps.get_db),
    property_id: uuid.UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get photos for a property.
    """
    property_obj = (
        db.query(models.Property).filter(models.Property.id == property_id).first()
    )
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    if property_obj.user_id != current_user.id and current_user.role not in [
        models.UserRole.ADMIN,
        models.UserRole.VALUER,
    ]:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return property_obj.photos


@router.delete("/photos/{photo_id}", response_model=schemas.PropertyPhoto)
def delete_property_photo(
    *,
    db: Session = Depends(deps.get_db),
    photo_id: uuid.UUID,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a property photo.
    """
    photo_obj = (
        db.query(models.PropertyPhoto)
        .filter(models.PropertyPhoto.id == photo_id)
        .first()
    )
    if not photo_obj:
        raise HTTPException(status_code=404, detail="Photo not found")

    property_obj = photo_obj.property
    if (
        property_obj.user_id != current_user.id
        and current_user.role != models.UserRole.ADMIN
    ):
        raise HTTPException(status_code=400, detail="Not enough permissions")

    # Delete from storage
    try:
        storage_service.delete_file(photo_obj.s3_key)
    except Exception:
        # Log error but continue with DB deletion
        pass

    db.delete(photo_obj)
    db.commit()
    return photo_obj
