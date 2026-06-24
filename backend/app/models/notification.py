from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class Notification(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    actor_username: str
    type: str  # "like" | "comment" | "follow"
    post_id: int | None = Field(default=None, foreign_key="post.id", nullable=True)
    read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
