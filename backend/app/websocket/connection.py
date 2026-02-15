import json
from typing import Any

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        # active_connections: {user_id: [WebSocket, ...]}
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str) -> None:
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: str) -> None:
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_personal_message(self, message: str, websocket: WebSocket) -> None:
        await websocket.send_text(message)

    async def broadcast(self, message: dict[str, Any]) -> None:
        """Broadcast a JSON message to all connected users."""
        payload = json.dumps(message)
        for user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_text(payload)

    async def send_to_user(self, user_id: str, message: dict[str, Any]) -> None:
        """Send a JSON message to all connections of a specific user."""
        if user_id not in self.active_connections:
            return

        payload = json.dumps(message)
        for connection in self.active_connections[user_id]:
            await connection.send_text(payload)


manager = ConnectionManager()
