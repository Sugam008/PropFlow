import logging

from app.utils.resilience import async_retry

logger = logging.getLogger(__name__)


class NotificationService:
    @async_retry(retries=3, backoff_in_seconds=2.0)
    async def send_sms(self, phone: str, message: str) -> bool:
        """Development stub for SMS delivery."""
        logger.info("DEV SMS -> %s: %s", phone, message)
        return True

    @async_retry(retries=3, backoff_in_seconds=2.0)
    async def send_whatsapp(self, phone: str, message: str) -> bool:
        """Development stub for WhatsApp delivery."""
        logger.info("DEV WHATSAPP -> %s: %s", phone, message)
        return True

    async def notify_property_submission(
        self, property_id: str, owner_phone: str
    ) -> None:
        """Notify owner about successful submission (development stub)."""
        await self.send_sms(
            owner_phone, "Your property has been submitted successfully!"
        )

    async def notify_valuation_complete(
        self, property_id: str, owner_phone: str, status: str
    ) -> None:
        """Notify owner about valuation completion/update."""
        message = f"Your property valuation for {property_id} is now {status}."
        await self.send_whatsapp(owner_phone, message)


notification_service = NotificationService()
