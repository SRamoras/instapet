from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class Comment(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    author_id: int = Field(foreign_key="user.id")
    post_id: int = Field(foreign_key="post.id")