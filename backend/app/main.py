import logging
import time
from typing import Any

from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import LoggingMiddleware
from app.core.redis import redis_client
from app.database import engine

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)
register_exception_handlers(app)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = (
        "max-age=31536000; includeSubDomains"
    )
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; frame-ancestors 'none';"
    )
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception caught: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": (
                "An unexpected error occurred. "
                "Please contact support if the problem persists."
            ),
            "error_type": "internal_server_error",
        },
    )


# Set all CORS enabled origins - allow all for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_middleware(LoggingMiddleware)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Welcome to PropFlow API"}


@app.get("/health")
def health() -> dict[str, Any]:
    health_status = {
        "status": "ok",
        "timestamp": time.time(),
        "services": {"database": "unknown", "redis": "unknown"},
    }

    # Check Database
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            health_status["services"]["database"] = "ok"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        health_status["services"]["database"] = "error"
        health_status["status"] = "error"

    # Check Redis
    try:
        if redis_client.ping():
            health_status["services"]["redis"] = "ok"
    except Exception as e:
        logger.error(f"Redis health check failed: {e}")
        health_status["services"]["redis"] = "error"
        health_status["status"] = "error"

    if health_status["status"] == "error":
        return JSONResponse(status_code=503, content=health_status)

    return health_status


@app.get(f"{settings.API_V1_STR}/status")
def api_status() -> dict[str, str]:
    return {"status": "ok", "service": settings.PROJECT_NAME}
