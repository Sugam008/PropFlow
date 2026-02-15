from pydantic import BaseModel, Field

from app.schemas.token import Token
from app.schemas.user import User


class PhoneLoginRequest(BaseModel):
    phone: str = Field(..., description="Phone number with country code")


class OTPVerifyRequest(BaseModel):
    phone: str = Field(..., description="Phone number with country code")
    otp: str = Field(..., description="6-digit OTP")


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(Token):
    pass


class OTPVerifyResponse(TokenResponse):
    user: User
