from collections.abc import Callable

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class AppError(Exception):
    def __init__(self, detail: str, status_code: int, error_type: str) -> None:
        self.detail = detail
        self.status_code = status_code
        self.error_type = error_type
        super().__init__(detail)


class InvalidOTPError(AppError):
    def __init__(self, detail: str = "Invalid or expired OTP") -> None:
        super().__init__(detail=detail, status_code=400, error_type="invalid_otp")


class ExpiredOTPError(AppError):
    def __init__(self, detail: str = "OTP has expired") -> None:
        super().__init__(detail=detail, status_code=400, error_type="expired_otp")


class RateLimitError(AppError):
    def __init__(self, detail: str = "Too many requests") -> None:
        super().__init__(detail=detail, status_code=429, error_type="rate_limit")


class UnauthorizedError(AppError):
    def __init__(
        self,
        detail: str = "Could not validate credentials",
        *,
        status_code: int = 403,
        error_type: str = "unauthorized",
    ) -> None:
        super().__init__(detail=detail, status_code=status_code, error_type=error_type)


class ForbiddenError(AppError):
    def __init__(
        self,
        detail: str = "The user doesn't have enough privileges",
        *,
        status_code: int = 400,
        error_type: str = "forbidden",
    ) -> None:
        super().__init__(detail=detail, status_code=status_code, error_type=error_type)


class NotFoundError(AppError):
    def __init__(self, detail: str = "Resource not found") -> None:
        super().__init__(detail=detail, status_code=404, error_type="not_found")


def _app_error_handler(_: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "error_type": exc.error_type},
    )


def register_exception_handlers(app: FastAPI) -> None:
    handler: Callable[[Request, AppError], JSONResponse] = _app_error_handler
    app.add_exception_handler(AppError, handler)
