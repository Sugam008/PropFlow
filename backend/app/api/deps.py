from collections.abc import Callable, Generator

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app import models, schemas
from app.core import security
from app.core.config import settings
from app.core.exceptions import (
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
)
from app.database import SessionLocal

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login/access-token"
)


def get_db() -> Generator[Session, None, None]:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> models.User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise UnauthorizedError(detail="Could not validate credentials") from None

    user = db.query(models.User).filter(models.User.id == token_data.sub).first()
    if not user:
        raise NotFoundError(detail="User not found")

    return user


def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not current_user.is_active:
        raise ForbiddenError(
            detail="Inactive user",
            status_code=400,
            error_type="inactive_user",
        )

    return current_user


def require_role(*roles: models.UserRole) -> Callable[[models.User], models.User]:
    def role_dependency(
        current_user: models.User = Depends(get_current_active_user),
    ) -> models.User:
        if current_user.role not in roles:
            raise ForbiddenError(
                detail="The user doesn't have enough privileges",
                status_code=400,
                error_type="insufficient_privileges",
            )

        return current_user

    return role_dependency


def get_current_active_admin(
    current_user: models.User = Depends(require_role(models.UserRole.ADMIN)),
) -> models.User:
    return current_user
