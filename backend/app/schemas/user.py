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
    follower_count: int = 0
    following_count: int = 0
    like_count: int = 0
    followed_by_me: bool = False


class UserUpdate(SQLModel):
    display_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None

    def model_post_init(self, __context):
        if self.display_name is not None and not self.display_name.strip():
            raise ValueError("display_name não pode ser vazio")