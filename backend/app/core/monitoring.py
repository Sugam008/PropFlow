# PropFlow Backend - Core Monitoring

import sentry_sdk
from sentry_sdk.integrations.celery import CeleryIntegration
from sentry_sdk.integrations.fastapi import FastApiIntegration

from app.core.config import settings


def init_sentry():
    if settings.SENTRY_DSN:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            environment=settings.ENVIRONMENT,
            traces_sample_rate=0.1,
            profiles_sample_rate=0.1,
            integrations=[
                FastApiIntegration(),
                CeleryIntegration(),
            ],
            beforeSend=before_send,
        )


def before_send(event, hint):
    if "exc_info" in hint:
        exc_type, exc_value, tb = hint["exc_info"]

        if exc_type and exc_type.__name__ in [
            "HTTPException",
            "ValidationError",
        ]:
            return None

    return event


def capture_exception(exc: Exception, **kwargs):
    if settings.SENTRY_DSN:
        sentry_sdk.capture_exception(exc, **kwargs)


def capture_message(message: str, level: str = "info", **kwargs):
    if settings.SENTRY_DSN:
        sentry_sdk.capture_message(message, level=level, **kwargs)


def set_user_context(user_id: str, phone: str, role: str):
    if settings.SENTRY_DSN:
        sentry_sdk.set_user(
            {
                "id": user_id,
                "username": phone,
                "role": role,
            }
        )


def clear_user_context():
    if settings.SENTRY_DSN:
        sentry_sdk.set_user(None)
