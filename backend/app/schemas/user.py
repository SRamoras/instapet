import re
from datetime import datetime
from sqlmodel import SQLModel
from pydantic import field_validator

_EMAIL_RE = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
_USERNAME_RE = re.compile(r'^[a-zA-Z0-9_]{3,30}$')


class UserCreate(SQLModel):
    username: str
    email: str
    password: str
    display_name: str

    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not _USERNAME_RE.match(v):
            raise ValueError('Username deve ter 3–30 caracteres (letras, números ou _)')
        return v

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not _EMAIL_RE.match(v):
            raise ValueError('Email inválido')
        return v

    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError('A senha deve ter pelo menos 6 caracteres')
        return v


class UserRead(SQLModel):
    id: int
    username: str
    email: str
    display_name: str | None
    bio: str | None
    avatar_url: str | None
    created_at: datetime
    follower_count: int = 0
    following_count: int = 0
    post_count: int = 0
    like_count: int = 0
    followed_by_me: bool = False


class UserUpdate(SQLModel):
    display_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None

    def model_post_init(self, __context):
        if self.display_name is not None and not self.display_name.strip():
            raise ValueError("display_name não pode ser vazio")