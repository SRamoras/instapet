from datetime import datetime
from sqlmodel import SQLModel


class UserCreate(SQLModel):
    username: str
    email: str
    password: str
    display_name: str | None = None


class UserRead(SQLModel):
    id: int
    username: str
    email: str
    display_name: str | None
    bio: str | None
    avatar_url: str | None
    created_at: datetime


class UserUpdate(SQLModel):
    display_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None