from datetime import datetime, timezone
from sqlmodel import SQLModel, Field

class Like(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    post_id: int = Field(foreign_key="post.id", primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))