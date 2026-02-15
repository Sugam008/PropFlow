import logging
from typing import Any

from app.core.config import settings

logger = logging.getLogger(__name__)


class SMSService:
    """Service for SMS notifications via Twilio."""

    def __init__(self) -> None:
        self.account_sid = getattr(settings, "TWILIO_ACCOUNT_SID", None)
        self.auth_token = getattr(settings, "TWILIO_AUTH_TOKEN", None)
        self.from_number = getattr(settings, "TWILIO_FROM_NUMBER", None)
        self.enabled = bool(self.account_sid and self.auth_token and self.from_number)

    def _send_via_twilio(self, to: str, message: str) -> dict[str, Any]:
        """Send SMS via Twilio API."""
        if not self.enabled:
            logger.warning("Twilio not configured, SMS not sent")
            return {"success": False, "error": "Twilio not configured"}

        try:
            from twilio.rest import Client

            client = Client(self.account_sid, self.auth_token)
            twilio_message = client.messages.create(
                body=message, from_=self.from_number, to=to
            )
            return {
                "success": True,
                "sid": twilio_message.sid,
                "status": twilio_message.status,
            }
        except ImportError:
            logger.error("twilio library not installed")
            return {"success": False, "error": "twilio not installed"}
        except Exception as e:
            logger.error(f"Twilio SMS error: {e}")
            return {"success": False, "error": str(e)}

    def send_sms(self, to: str, message: str) -> dict[str, Any]:
        """Send SMS to a phone number."""
        if settings.ENVIRONMENT == "local":
            logger.info(f"[DEV SMS] To: {to}, Message: {message}")
            return {"success": True, "mode": "dev", "to": to, "message": message}

        return self._send_via_twilio(to, message)

    def send_otp(self, phone: str, otp: str) -> dict[str, Any]:
        """Send OTP via SMS."""
        message = f"Your PropFlow verification code is: {otp}. Valid for 5 minutes."
        return self.send_sms(phone, message)

    def send_status_update(
        self, phone: str, status: str, reference_id: str
    ) -> dict[str, Any]:
        """Send property status update notification."""
        status_messages = {
            "SUBMITTED": (
                f"Your property submission (Ref: {reference_id}) "
                "has been received. We'll notify you once it's under review."
            ),
            "UNDER_REVIEW": (
                f"Your property (Ref: {reference_id}) is now under review by a valuer."
            ),
            "APPROVED": (
                f"Great news! Your property (Ref: {reference_id}) has been approved. "
                "Check the app for valuation details."
            ),
            "REJECTED": (
                f"Your property (Ref: {reference_id}) could not be approved. "
                "Please check the app for details."
            ),
            "FOLLOW_UP": (
                f"Action required for your property (Ref: {reference_id}). "
                "Please check the app for details."
            ),
        }

        message = status_messages.get(
            status, f"Property update for Ref: {reference_id}"
        )
        return self.send_sms(phone, message)

    def send_submission_confirmation(
        self, phone: str, reference_id: str, eta_hours: int = 5
    ) -> dict[str, Any]:
        """Send submission confirmation."""
        message = (
            f"Your property has been submitted (Ref: {reference_id}). "
            f"Expected valuation within {eta_hours} hours. "
            "Track progress in the PropFlow app."
        )
        return self.send_sms(phone, message)

    def send_valuation_complete(
        self, phone: str, reference_id: str, estimated_value: float
    ) -> dict[str, Any]:
        """Send valuation completion notification."""
        formatted_value = f"₹{estimated_value:,.0f}"
        message = (
            f"Your property valuation is complete (Ref: {reference_id}). "
            f"Estimated value: {formatted_value}. View details in the PropFlow app."
        )
        return self.send_sms(phone, message)


sms_service = SMSService()
