import logging
from typing import Any

from app.core.config import settings

logger = logging.getLogger(__name__)


class WhatsAppService:
    """Service for WhatsApp notifications."""

    def __init__(self) -> None:
        self.api_token = getattr(settings, "WHATSAPP_API_TOKEN", None)
        self.phone_number_id = getattr(settings, "WHATSAPP_PHONE_NUMBER_ID", None)
        self.enabled = bool(self.api_token and self.phone_number_id)

    def _send_via_api(
        self, to: str, template: str, parameters: dict[str, str]
    ) -> dict[str, Any]:
        """Send WhatsApp message via Meta API."""
        if not self.enabled:
            logger.warning("WhatsApp API not configured")
            return {"success": False, "error": "WhatsApp not configured"}

        try:
            import requests

            url = f"https://graph.facebook.com/v18.0/{self.phone_number_id}/messages"
            headers = {
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json",
            }
            payload = {
                "messaging_product": "whatsapp",
                "to": to.lstrip("+"),
                "type": "template",
                "template": {
                    "name": template,
                    "language": {"code": "en_US"},
                    "components": [
                        {
                            "type": "body",
                            "parameters": [
                                {"type": "text", "parameter_name": k, "text": v}
                                for k, v in parameters.items()
                            ],
                        }
                    ],
                },
            }

            response = requests.post(url, json=payload, headers=headers)
            if response.status_code == 200:
                return {"success": True, "response": response.json()}
            else:
                return {"success": False, "error": response.text}

        except ImportError:
            logger.error("requests library not available")
            return {"success": False, "error": "requests not installed"}
        except Exception as e:
            logger.error(f"WhatsApp API error: {e}")
            return {"success": False, "error": str(e)}

    def send_whatsapp(
        self, to: str, template: str, parameters: dict[str, str]
    ) -> dict[str, Any]:
        """Send WhatsApp message."""
        if settings.ENVIRONMENT == "local":
            logger.info(
                f"[DEV WhatsApp] To: {to}, Template: {template}, Params: {parameters}"
            )
            return {"success": True, "mode": "dev", "to": to, "template": template}

        return self._send_via_api(to, template, parameters)

    def send_submission_received(self, to: str, reference_id: str) -> dict[str, Any]:
        """Send submission received template."""
        return self.send_whatsapp(
            to, "submission_received", {"reference_id": reference_id}
        )

    def send_review_started(
        self, to: str, reference_id: str, valuer_name: str
    ) -> dict[str, Any]:
        """Send review started template."""
        return self.send_whatsapp(
            to,
            "review_started",
            {"reference_id": reference_id, "valuer_name": valuer_name},
        )

    def send_valuation_complete(
        self, to: str, reference_id: str, estimated_value: str
    ) -> dict[str, Any]:
        """Send valuation complete template."""
        return self.send_whatsapp(
            to,
            "valuation_complete",
            {"reference_id": reference_id, "estimated_value": estimated_value},
        )

    def send_follow_up_required(
        self, to: str, reference_id: str, issue_description: str
    ) -> dict[str, Any]:
        """Send follow up required template."""
        return self.send_whatsapp(
            to,
            "follow_up_required",
            {"reference_id": reference_id, "issue_description": issue_description},
        )

    def send_approval(
        self, to: str, reference_id: str, estimated_value: str
    ) -> dict[str, Any]:
        """Send approval notification."""
        return self.send_whatsapp(
            to,
            "property_approved",
            {"reference_id": reference_id, "estimated_value": estimated_value},
        )

    def send_rejection(self, to: str, reference_id: str, reason: str) -> dict[str, Any]:
        """Send rejection notification."""
        return self.send_whatsapp(
            to, "property_rejected", {"reference_id": reference_id, "reason": reason}
        )


whatsapp_service = WhatsAppService()
