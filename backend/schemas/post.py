from datetime import datetime
from sqlmodel import SQLModel


class PostCreate(SQLModel):
    content: str
    image_url: str | None = None
    tags: list[str] = []  


class PostRead(SQLModel):
    id: int
    content: str
    image_url: str | None
    created_at: datetime
    author_id: int
    author_username: str
    tags: list[str]
    like_count: int
    comment_count: int
    save_count: int
    liked_by_me: bool
    saved_by_me: bool