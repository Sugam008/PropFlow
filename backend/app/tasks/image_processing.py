import uuid
from datetime import UTC, datetime, timedelta
from typing import Any

from app.celery_app import celery_app
from app.crud.crud_photo import photo as crud_photo
from app.database import SessionLocal
from app.models.photo import QCStatus
from app.services.image_service import image_service


@celery_app.task(
    name="process_photo",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 5},
)  # type: ignore
def process_photo(self, photo_id: str, file_path: str) -> dict[str, Any]:
    """
    Background task to process an uploaded photo.
    Extracts EXIF and performs QC checks.
    """
    db = SessionLocal()
    try:
        photo_uuid = uuid.UUID(photo_id)
        photo_obj = crud_photo.get(db, id=photo_uuid)
        if not photo_obj:
            return {"error": "Photo not found"}

        # Extract EXIF
        exif_data = image_service.get_exif_data(file_path)

        # Optimize image for storage and delivery
        image_service.optimize_image(file_path)

        # Perform QC
        qc_data = image_service.perform_qc_checks(file_path)

        metadata_failures: list[str] = []
        captured_at = exif_data.get("captured_at")
        if captured_at is None:
            metadata_failures.append("Missing capture timestamp metadata")
        else:
            captured_at_utc = (
                captured_at.replace(tzinfo=UTC)
                if captured_at.tzinfo is None
                else captured_at.astimezone(UTC)
            )
            if captured_at_utc < datetime.now(UTC) - timedelta(minutes=30):
                metadata_failures.append("Capture timestamp is older than 30 minutes")

        if not exif_data.get("device_model"):
            metadata_failures.append("Missing device model metadata")

        gps_lat = exif_data.get("gps_lat")
        gps_lng = exif_data.get("gps_lng")
        if gps_lat is None or gps_lng is None:
            metadata_failures.append("Missing GPS metadata")
        elif photo_obj.property.lat is not None and photo_obj.property.lng is not None:
            distance_km = image_service.haversine_distance(
                gps_lat,
                gps_lng,
                photo_obj.property.lat,
                photo_obj.property.lng,
            )
            if distance_km > 0.5:
                metadata_failures.append(
                    f"Photo GPS mismatch: {distance_km:.2f}km from property"
                )

        # Update photo record
        is_verified = not (
            qc_data["is_blurry"]
            or qc_data["is_too_dark"]
            or qc_data["is_too_bright"]
            or metadata_failures
        )

        qc_notes = f"QC results: {qc_data}"
        if metadata_failures:
            qc_notes = f"{qc_notes}; metadata failures: {metadata_failures}"

        # Map QC data to model fields
        update_data = {
            "captured_at": exif_data.get("captured_at"),
            "device_model": exif_data.get("device_model"),
            "gps_lat": exif_data.get("gps_lat"),
            "gps_lng": exif_data.get("gps_lng"),
            "qc_status": QCStatus.APPROVED if is_verified else QCStatus.REJECTED,
            "qc_notes": qc_notes,
        }

        crud_photo.update(db, db_obj=photo_obj, obj_in=update_data)

        return {"status": "completed", "photo_id": photo_id}
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()
