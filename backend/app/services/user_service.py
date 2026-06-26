from sqlmodel import Session, select

from app.models.user import User
from app.models.follow import Follow
from app.models.post import Post
from app.models.like import Like
from app.schemas.user import UserRead


def enrich_user(user: User, session: Session, current_user_id: int | None = None) -> UserRead:
    follower_count = len(session.exec(select(Follow).where(Follow.following_id == user.id)).all())
    following_count = len(session.exec(select(Follow).where(Follow.follower_id == user.id)).all())
    followed_by_me = (
        session.get(Follow, (current_user_id, user.id)) is not None
        if current_user_id else False
    )
    user_posts = session.exec(select(Post).where(Post.author_id == user.id)).all()
    post_count = len(user_posts)
    like_count = sum(
        len(session.exec(select(Like).where(Like.post_id == p.id)).all())
        for p in user_posts
    )
    return UserRead(
        **user.model_dump(),
        follower_count=follower_count,
        following_count=following_count,
        post_count=post_count,
        like_count=like_count,
        followed_by_me=followed_by_me,
    )
