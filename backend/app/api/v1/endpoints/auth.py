from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.core import security
from app.core.config import settings
from app.core.exceptions import (
    ForbiddenError,
    InvalidOTPError,
    RateLimitError,
    UnauthorizedError,
)
from app.services.otp_service import otp_service

router = APIRouter()


@router.post("/login/otp", status_code=status.HTTP_200_OK)
def request_otp(
    login_data: schemas.PhoneLoginRequest,
) -> Any:
    """
    Request an OTP for phone login.
    """
    otp = otp_service.send_otp(login_data.phone)
    if not otp:
        raise RateLimitError(detail="Too many OTP requests. Please try again later.")

    # In development, we return the OTP. In production, this would be sent via SMS.
    if settings.ENVIRONMENT == "local":
        return {"msg": "OTP sent successfully", "otp": otp}
    return {"msg": "OTP sent successfully"}


@router.post("/verify-otp", response_model=schemas.OTPVerifyResponse)
def verify_otp(
    verify_data: schemas.OTPVerifyRequest,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Verify OTP and return access token. Creates user if they don't exist.
    """
    if not otp_service.verify_otp(verify_data.phone, verify_data.otp):
        raise InvalidOTPError()

    # Check if user exists, create if not
    user = crud.user.get_by_phone(db, phone=verify_data.phone)
    if not user:
        # Create a new user with default role
        # Random password for OTP users
        random_password = security.generate_password()
        user_in = schemas.UserCreate(
            phone=verify_data.phone,
            name=f"User {verify_data.phone[-4:]}",
            password=random_password,
        )
        user = crud.user.create(db, obj_in=user_in)

    if not user.is_active:
        raise ForbiddenError(
            detail="Inactive user",
            status_code=400,
            error_type="inactive_user",
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
        "user": user,
    }


@router.post("/login/access-token", response_model=schemas.TokenResponse)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(models.User).filter(models.User.phone == form_data.username).first()
    if not user or not security.verify_password(
        form_data.password, user.hashed_password
    ):
        raise UnauthorizedError(
            detail="Incorrect phone or password",
            status_code=400,
            error_type="invalid_credentials",
        )
    elif not user.is_active:
        raise ForbiddenError(
            detail="Inactive user",
            status_code=400,
            error_type="inactive_user",
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/refresh", response_model=schemas.TokenResponse)
def refresh_access_token(refresh_data: schemas.RefreshRequest) -> Any:
    """Refresh an access token using a refresh token payload."""
    try:
        payload = jwt.decode(
            refresh_data.refresh_token,
            settings.SECRET_KEY,
            algorithms=[security.ALGORITHM],
        )
    except JWTError as exc:
        raise UnauthorizedError(
            detail="Invalid refresh token",
            status_code=400,
            error_type="invalid_refresh_token",
        ) from exc

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedError(
            detail="Invalid refresh token",
            status_code=400,
            error_type="invalid_refresh_token",
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user_id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout() -> dict[str, str]:
    """Client-side logout acknowledgement endpoint."""
    return {"msg": "Logged out successfully"}
