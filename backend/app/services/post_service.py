from sqlmodel import Session, select

from app.models import Tag, PostTag, Like, Save, Comment, User, Follow
from app.models.post import Post
from app.schemas.post import PostRead


def enrich_post(post: Post, session: Session, current_user_id: int | None = None) -> PostRead:
    user = session.get(User, post.author_id)

    post_tags = session.exec(select(PostTag).where(PostTag.post_id == post.id)).all()
    tag_names = []
    for pt in post_tags:
        tag = session.get(Tag, pt.tag_id)
        if tag:
            tag_names.append(tag.name)

    likes = session.exec(select(Like).where(Like.post_id == post.id)).all()
    saves = session.exec(select(Save).where(Save.post_id == post.id)).all()
    comments = session.exec(select(Comment).where(Comment.post_id == post.id)).all()

    liked_by_me = any(l.user_id == current_user_id for l in likes) if current_user_id else False
    saved_by_me = any(s.user_id == current_user_id for s in saves) if current_user_id else False
    author_followed_by_me = (
        session.get(Follow, (current_user_id, post.author_id)) is not None
        if current_user_id else False
    )

    return PostRead(
        id=post.id,
        content=post.content,
        image_url=post.image_url,
        created_at=post.created_at,
        author_id=post.author_id,
        author_username=user.username if user else None,
        author_avatar_url=user.avatar_url if user else None,
        tags=tag_names,
        like_count=len(likes),
        save_count=len(saves),
        comment_count=len(comments),
        liked_by_me=liked_by_me,
        saved_by_me=saved_by_me,
        author_followed_by_me=author_followed_by_me,
    )


def get_or_create_tags(session: Session, tag_names: list[str]) -> list[Tag]:
    tags = []
    for name in tag_names:
        name = name.strip().lower().lstrip("#")
        if not name:
            continue
        tag = session.exec(select(Tag).where(Tag.name == name)).first()
        if not tag:
            tag = Tag(name=name)
            session.add(tag)
            session.flush()
        tags.append(tag)
    return tags
