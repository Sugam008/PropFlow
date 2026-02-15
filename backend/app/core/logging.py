import json
import logging
import sys
import time
from typing import Any

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class StructuredLogger:
    def __init__(self, name: str = "propflow"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)

        # Console handler with JSON formatting
        handler = logging.StreamHandler(sys.stdout)
        self.logger.addHandler(handler)

    def _format_log(
        self, level: str, msg: str, extra: dict[str, Any] | None = None
    ) -> str:
        log_data = {
            "timestamp": time.time(),
            "level": level,
            "message": msg,
        }
        if extra:
            log_data.update(extra)
        return json.dumps(log_data)

    def info(self, msg: str, extra: dict[str, Any] | None = None) -> None:
        self.logger.info(self._format_log("INFO", msg, extra))

    def error(self, msg: str, extra: dict[str, Any] | None = None) -> None:
        self.logger.error(self._format_log("ERROR", msg, extra))


logger = StructuredLogger()


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Any) -> Response:
        start_time = time.time()

        response: Response = await call_next(request)

        process_time = time.time() - start_time

        logger.info(
            "API Request",
            extra={
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "duration": f"{process_time:.4f}s",
                "client_ip": request.client.host if request.client else "unknown",
            },
        )

        return response
