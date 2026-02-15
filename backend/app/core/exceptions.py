from collections.abc import Callable

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class AppException(Exception):
    def __init__(self, detail: str, status_code: int, error_type: str) -> None:
        self.detail = detail
        self.status_code = status_code
        self.error_type = error_type
        super().__init__(detail)


class InvalidOTPException(AppException):
    def __init__(self, detail: str = "Invalid or expired OTP") -> None:
        super().__init__(detail=detail, status_code=400, error_type="invalid_otp")


class ExpiredOTPException(AppException):
    def __init__(self, detail: str = "OTP has expired") -> None:
        super().__init__(detail=detail, status_code=400, error_type="expired_otp")


class RateLimitException(AppException):
    def __init__(self, detail: str = "Too many requests") -> None:
        super().__init__(detail=detail, status_code=429, error_type="rate_limit")


class UnauthorizedException(AppException):
    def __init__(
        self,
        detail: str = "Could not validate credentials",
        *,
        status_code: int = 403,
        error_type: str = "unauthorized",
    ) -> None:
        super().__init__(detail=detail, status_code=status_code, error_type=error_type)


class ForbiddenException(AppException):
    def __init__(
        self,
        detail: str = "The user doesn't have enough privileges",
        *,
        status_code: int = 400,
        error_type: str = "forbidden",
    ) -> None:
        super().__init__(detail=detail, status_code=status_code, error_type=error_type)


class NotFoundException(AppException):
    def __init__(self, detail: str = "Resource not found") -> None:
        super().__init__(detail=detail, status_code=404, error_type="not_found")


def _app_exception_handler(_: Request, exc: AppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "error_type": exc.error_type},
    )


def register_exception_handlers(app: FastAPI) -> None:
    handler: Callable[[Request, AppException], JSONResponse] = _app_exception_handler
    app.add_exception_handler(AppException, handler)
