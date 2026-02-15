import random
import string

from app.core.redis import redis_client


class OTPService:
    def __init__(self) -> None:
        self.otp_expiry = 300  # 5 minutes
        self.rate_limit_expiry = 600  # 10 minutes
        self.max_attempts = 3

    def generate_otp(self, length: int = 6) -> str:
        """Generate a random numeric OTP."""
        return "".join(random.choices(string.digits, k=length))

    def get_otp_key(self, phone: str) -> str:
        return f"otp:{phone}"

    def get_rate_limit_key(self, phone: str) -> str:
        return f"otp_count:{phone}"

    def check_rate_limit(self, phone: str) -> bool:
        """
        Check if the phone number has exceeded the OTP request limit.
        Returns True if allowed, False if rate limited.
        """
        key = self.get_rate_limit_key(phone)
        count = redis_client.get(key)

        if count is not None and int(str(count)) >= self.max_attempts:
            return False
        return True

    def increment_rate_limit(self, phone: str) -> None:
        """Increment the OTP request count for the phone number."""
        key = self.get_rate_limit_key(phone)
        pipe = redis_client.pipeline()
        pipe.incr(key)
        # Set expiry only if it's a new key
        pipe.expire(key, self.rate_limit_expiry, nx=True)
        pipe.execute()  # type: ignore[no-untyped-call]

    def send_otp(self, phone: str) -> str | None:
        """
        Generate and store OTP in Redis.
        In a real app, this would also trigger an SMS/WhatsApp service.
        Returns the OTP for development/testing purposes.
        """
        if not self.check_rate_limit(phone):
            return None

        otp = self.generate_otp()
        redis_client.setex(self.get_otp_key(phone), self.otp_expiry, otp)
        self.increment_rate_limit(phone)

        # Development mode returns OTP directly for test/dev flows.
        return otp

    def verify_otp(self, phone: str, otp: str) -> bool:
        """Verify the OTP provided for the phone number."""
        key = self.get_otp_key(phone)
        stored_otp = redis_client.get(key)

        if stored_otp == otp:
            # Delete OTP after successful verification
            redis_client.delete(key)
            return True
        return False


otp_service = OTPService()
