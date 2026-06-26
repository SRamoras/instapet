from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    password: str
    display_name: str
    bio: str | None = None
    avatar_url: str = "https://img.myloview.com/murals/default-avatar-profile-icon-vector-social-media-user-symbol-image-700-244492311.jpg"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

