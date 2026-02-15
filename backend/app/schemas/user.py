import uuid

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.user import UserRole


# Shared properties
class UserBase(BaseModel):
    phone: str
    email: EmailStr | None = None
    name: str | None = None
    role: UserRole = UserRole.CUSTOMER
    is_active: bool = True


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str


# Properties to receive via API on update
class UserUpdate(BaseModel):
    phone: str | None = None
    email: EmailStr | None = None
    name: str | None = None
    password: str | None = None
    role: UserRole | None = None
    is_active: bool | None = None


class UserInDBBase(UserBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class User(UserInDBBase):
    pass


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str
