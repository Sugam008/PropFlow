from typing import Any

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app import models
from app.api import deps
from app.core import security
from app.core.config import settings
from app.websocket.connection import manager

router = APIRouter()


@router.websocket("/ws/{token}")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    WebSocket endpoint for real-time updates.
    Authenticates user via JWT token in the URL.
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        user_id = payload.get("sub")
        if user_id is None:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
    except JWTError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or not user.is_active:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await manager.connect(websocket, str(user.id))
    try:
        while True:
            # Keep connection alive and listen for any client messages
            data = await websocket.receive_text()
            # We don't expect messages from clients for now, but we can handle them here
            await manager.send_personal_message(f"Message received: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket, str(user.id))
