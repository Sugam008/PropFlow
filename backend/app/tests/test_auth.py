import uuid

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings


def test_otp_login_flow(client: TestClient, db: Session) -> None:
    # Use a unique phone number to avoid rate limiting
    phone = f"+1{str(uuid.uuid4().int)[:10]}"

    # 1. Request OTP
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/otp",
        json={"phone": phone},
    )
    assert response.status_code == 200
    data = response.json()
    assert "otp" in data
    otp = data["otp"]

    # 2. Verify OTP
    response = client.post(
        f"{settings.API_V1_STR}/auth/verify-otp",
        json={"phone": phone, "otp": otp},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["phone"] == phone

    # 3. Check if user was created
    user = crud.user.get_by_phone(db, phone=phone)
    assert user is not None
    assert user.phone == phone


def test_invalid_otp(client: TestClient) -> None:
    # Use a unique phone number to avoid rate limiting
    phone = f"+1{str(uuid.uuid4().int)[:10]}"

    # Request OTP
    client.post(
        f"{settings.API_V1_STR}/auth/login/otp",
        json={"phone": phone},
    )

    # Verify with wrong OTP
    response = client.post(
        f"{settings.API_V1_STR}/auth/verify-otp",
        json={"phone": phone, "otp": "000000"},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid or expired OTP"


def test_refresh_and_logout(client: TestClient) -> None:
    phone = f"+1{str(uuid.uuid4().int)[:10]}"

    otp_response = client.post(
        f"{settings.API_V1_STR}/auth/login/otp",
        json={"phone": phone},
    )
    otp = otp_response.json()["otp"]

    verify_response = client.post(
        f"{settings.API_V1_STR}/auth/verify-otp",
        json={"phone": phone, "otp": otp},
    )
    access_token = verify_response.json()["access_token"]

    refresh_response = client.post(
        f"{settings.API_V1_STR}/auth/refresh",
        json={"refresh_token": access_token},
    )
    assert refresh_response.status_code == 200
    assert "access_token" in refresh_response.json()

    logout_response = client.post(f"{settings.API_V1_STR}/auth/logout")
    assert logout_response.status_code == 200
    assert logout_response.json()["msg"] == "Logged out successfully"
