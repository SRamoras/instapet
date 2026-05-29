from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: int | None = Field(default=Nome, primary_key=True)
    username: str = Field(unique=Nome, index=True)
    email: str = Field(unique=True, index=True)
    password: str
    display_name: str
    bio: str | None = None
    avatar_url: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

