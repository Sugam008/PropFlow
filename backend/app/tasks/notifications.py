from typing import Any

from app.celery_app import celery_app
from app.database import SessionLocal
from app.services.sms_service import sms_service
from app.services.whatsapp_service import whatsapp_service


@celery_app.task(
    name="send_sms_notification",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def send_sms_notification(self, phone: str, message: str) -> dict[str, Any]:
    """Send SMS notification asynchronously."""
    try:
        result = sms_service.send_sms(phone, message)
        return {"status": "sent", "phone": phone, "result": result}
    except Exception as e:
        return {"status": "failed", "error": str(e)}


@celery_app.task(
    name="send_otp_sms",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def send_otp_sms(self, phone: str, otp: str) -> dict[str, Any]:
    """Send OTP via SMS asynchronously."""
    try:
        result = sms_service.send_otp(phone, otp)
        return {"status": "sent", "phone": phone, "result": result}
    except Exception as e:
        return {"status": "failed", "error": str(e)}


@celery_app.task(
    name="send_status_update_sms",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def send_status_update_sms(
    self, phone: str, status: str, reference_id: str
) -> dict[str, Any]:
    """Send status update SMS asynchronously."""
    try:
        result = sms_service.send_status_update(phone, status, reference_id)
        return {
            "status": "sent",
            "phone": phone,
            "property_status": status,
            "result": result,
        }
    except Exception as e:
        return {"status": "failed", "error": str(e)}


@celery_app.task(
    name="send_submission_confirmation",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def send_submission_confirmation(
    self, phone: str, reference_id: str, eta_hours: int = 5
) -> dict[str, Any]:
    """Send submission confirmation asynchronously."""
    try:
        result = sms_service.send_submission_confirmation(
            phone, reference_id, eta_hours
        )
        return {"status": "sent", "phone": phone, "result": result}
    except Exception as e:
        return {"status": "failed", "error": str(e)}


@celery_app.task(
    name="send_valuation_complete",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def send_valuation_complete_sms(
    self, phone: str, reference_id: str, estimated_value: float
) -> dict[str, Any]:
    """Send valuation complete notification asynchronously."""
    try:
        result = sms_service.send_valuation_complete(
            phone, reference_id, estimated_value
        )
        return {"status": "sent", "phone": phone, "result": result}
    except Exception as e:
        return {"status": "failed", "error": str(e)}


@celery_app.task(
    name="send_whatsapp_notification",
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def send_whatsapp_notification(
    self, to: str, template: str, parameters: dict[str, str]
) -> dict[str, Any]:
    """Send WhatsApp notification asynchronously."""
    try:
        result = whatsapp_service.send_whatsapp(to, template, parameters)
        return {"status": "sent", "to": to, "template": template, "result": result}
    except Exception as e:
        return {"status": "failed", "error": str(e)}


@celery_app.task(name="notify_submission")
def notify_submission(
    property_id: str, phone: str, reference_id: str
) -> dict[str, Any]:
    """Send all notifications for a new submission."""
    db = SessionLocal()
    try:
        results = []

        sms_result = sms_service.send_submission_confirmation(phone, reference_id)
        results.append({"channel": "sms", "result": sms_result})

        wa_result = whatsapp_service.send_submission_received(phone, reference_id)
        results.append({"channel": "whatsapp", "result": wa_result})

        return {"status": "completed", "results": results}
    except Exception as e:
        return {"status": "failed", "error": str(e)}
    finally:
        db.close()


@celery_app.task(name="notify_status_change")
def notify_status_change(
    property_id: str,
    phone: str,
    reference_id: str,
    status: str,
    valuer_name: str | None = None,
) -> dict[str, Any]:
    """Send notifications for status change."""
    results = []

    sms_result = sms_service.send_status_update(phone, status, reference_id)
    results.append({"channel": "sms", "result": sms_result})

    if status == "SUBMITTED":
        wa_result = whatsapp_service.send_submission_received(phone, reference_id)
    elif status == "UNDER_REVIEW" and valuer_name:
        wa_result = whatsapp_service.send_review_started(
            phone, reference_id, valuer_name
        )
    elif status == "APPROVED":
        wa_result = whatsapp_service.send_approval(phone, reference_id, "view in app")
    elif status == "REJECTED":
        wa_result = whatsapp_service.send_rejection(phone, reference_id, "check app")
    elif status == "FOLLOW_UP":
        wa_result = whatsapp_service.send_follow_up_required(
            phone, reference_id, "check app for details"
        )
    else:
        wa_result = None

    if wa_result:
        results.append({"channel": "whatsapp", "result": wa_result})

    return {"status": "completed", "results": results}


@celery_app.task(name="notify_valuation_complete")
def notify_valuation_complete(
    property_id: str, phone: str, reference_id: str, estimated_value: float
) -> dict[str, Any]:
    """Send notifications when valuation is complete."""
    from app.services.whatsapp_service import whatsapp_service

    results = []

    sms_result = sms_service.send_valuation_complete(
        phone, reference_id, estimated_value
    )
    results.append({"channel": "sms", "result": sms_result})

    formatted_value = f"₹{estimated_value:,.0f}"
    wa_result = whatsapp_service.send_valuation_complete(
        phone, reference_id, formatted_value
    )
    results.append({"channel": "whatsapp", "result": wa_result})

    return {"status": "completed", "results": results}
