import logging
from datetime import datetime
from typing import Any

from sqlalchemy import select

from app.celery_app import celery_app
from app.core.redis import redis_client
from app.database import SessionLocal
from app.models.property import Property, PropertyStatus

logger = logging.getLogger(__name__)


@celery_app.task(name="cleanup_expired_sessions")
def cleanup_expired_sessions() -> dict[str, int]:
    """
    Periodic task to clean up expired sessions from Redis.
    This is a maintenance task that can be scheduled to run periodically.
    """
    try:
        deleted_count = 0

        pattern = "session:*"
        cursor = 0
        while True:
            cursor, keys = redis_client.scan(cursor, match=pattern, count=100)
            if keys:
                deleted_count += redis_client.delete(*keys)
            if cursor == 0:
                break

        logger.info(f"Cleaned up {deleted_count} expired sessions")
        return {"status": "completed", "deleted_count": deleted_count}
    except Exception as e:
        logger.error(f"Session cleanup error: {e}")
        return {"status": "failed", "error": str(e)}


@celery_app.task(name="cleanup_expired_otps")
def cleanup_expired_otps() -> dict[str, int]:
    """
    Periodic task to clean up expired OTP keys.
    Redis handles TTL automatically, but this task can log/monitor OTP usage.
    """
    try:
        pattern = "otp:*"
        cursor = 0
        total_otps = 0
        while True:
            cursor, keys = redis_client.scan(cursor, match=pattern, count=100)
            total_otps += len(keys)
            if cursor == 0:
                break

        logger.info(f"Current active OTPs: {total_otps}")
        return {"status": "completed", "active_otps": total_otps}
    except Exception as e:
        logger.error(f"OTP cleanup error: {e}")
        return {"status": "failed", "error": str(e)}


@celery_app.task(name="cleanup_orphaned_uploads")
def cleanup_orphaned_uploads() -> dict[str, int]:
    """
    Periodic task to clean up orphaned uploads that were uploaded but never associated
    with a property (e.g., incomplete submissions).
    """
    from app.models.photo import PropertyPhoto

    db = SessionLocal()
    try:
        deleted_count = 0

        result = db.execute(
            select(PropertyPhoto).where(PropertyPhoto.property_id.is_(None))
        )
        orphaned_photos = result.scalars().all()

        for photo in orphaned_photos:
            db.delete(photo)
            deleted_count += 1

        db.commit()
        logger.info(f"Cleaned up {deleted_count} orphaned photos")
        return {"status": "completed", "deleted_count": deleted_count}
    except Exception as e:
        db.rollback()
        logger.error(f"Orphaned upload cleanup error: {e}")
        return {"status": "failed", "error": str(e)}
    finally:
        db.close()


@celery_app.task(name="cleanup_draft_properties")
def cleanup_draft_properties() -> dict[str, int]:
    """
    Periodic task to clean up old draft properties that were never submitted.
    Properties in DRAFT status older than 30 days can be auto-deleted.
    """
    from datetime import timedelta

    db = SessionLocal()
    try:
        cutoff_date = datetime.now() - timedelta(days=30)

        result = db.execute(
            select(Property).where(
                Property.status == PropertyStatus.DRAFT,
                Property.created_at < cutoff_date,
            )
        )
        old_drafts = result.scalars().all()

        deleted_count = len(old_drafts)
        for prop in old_drafts:
            db.delete(prop)

        db.commit()
        logger.info(f"Cleaned up {deleted_count} old draft properties")
        return {"status": "completed", "deleted_count": deleted_count}
    except Exception as e:
        db.rollback()
        logger.error(f"Draft property cleanup error: {e}")
        return {"status": "failed", "error": str(e)}
    finally:
        db.close()


@celery_app.task(name="cleanup_old_audit_logs")
def cleanup_old_audit_logs() -> dict[str, int]:
    """
    Periodic task to archive or clean up old audit logs.
    Keep audit logs for 1 year, then archive/delete.
    """
    from datetime import timedelta

    from app.models.audit_log import AuditLog

    db = SessionLocal()
    try:
        cutoff_date = datetime.now() - timedelta(days=365)

        result = db.execute(select(AuditLog).where(AuditLog.timestamp < cutoff_date))
        old_logs = result.scalars().all()

        deleted_count = len(old_logs)
        for log in old_logs:
            db.delete(log)

        db.commit()
        logger.info(f"Cleaned up {deleted_count} old audit logs")
        return {"status": "completed", "deleted_count": deleted_count}
    except Exception as e:
        db.rollback()
        logger.error(f"Audit log cleanup error: {e}")
        return {"status": "failed", "error": str(e)}
    finally:
        db.close()


@celery_app.task(name="run_all_cleanup")
def run_all_cleanup() -> dict[str, Any]:
    """Run all cleanup tasks."""
    results = []

    results.append(cleanup_expired_sessions())
    results.append(cleanup_expired_otps())
    results.append(cleanup_orphaned_uploads())
    results.append(cleanup_draft_properties())

    return {"status": "completed", "tasks": results}
