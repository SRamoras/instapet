from datetime import datetime
from sqlmodel import SQLModel


class NotificationRead(SQLModel):
    id: int
    type: str
    actor_username: str
    post_id: int | None = None
    read: bool
    created_at: datetime
