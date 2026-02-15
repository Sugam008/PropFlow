import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import crud
from app.core.config import settings
from app.schemas.user import UserCreate


@pytest.mark.asyncio
async def test_websocket_connection(client: TestClient, db: Session) -> None:
    # Create user
    phone = f"+1{str(uuid.uuid4().int)[:10]}"
    user_in = UserCreate(phone=phone, name="WS User", password="password")
    crud.user.create(db, obj_in=user_in)

    # Login
    response = client.post(
        f"{settings.API_V1_STR}/auth/login/access-token",
        data={"username": phone, "password": "password"},
    )
    token = response.json()["access_token"]

    # Connect to websocket
    # Note: TestClient support for websockets is slightly different
    with client.websocket_connect(f"{settings.API_V1_STR}/ws/{token}") as websocket:
        websocket.send_text("hello")
        response_text = websocket.receive_text()
        assert "Message received: hello" in response_text

def test_websocket_unauthorized(client: TestClient) -> None:
    # Try to connect with invalid token
    try:
        with client.websocket_connect(
            f"{settings.API_V1_STR}/ws/invalid-token"
        ):
            pytest.fail("Should have raised an error or closed connection")
    except Exception:
        # Invalid token should fail websocket connection.
        pass
