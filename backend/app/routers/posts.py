from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select

from app.database.database import get_db
from app.models import Post, Tag, PostTag, Like, Save, Comment, Notification, User, Follow
from app.schemas.post import PostCreate, PostRead, PostUpdate
from app.auth.dependencies import get_current_user, get_optional_user
from app.services.post_service import enrich_post, get_or_create_tags

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("/", response_model=PostRead, status_code=201)
def create_post(
    data: PostCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    post = Post(content=data.content, image_url=data.image_url, author_id=current_user.id)
    session.add(post)
    session.flush()

    for tag in get_or_create_tags(session, data.tags):
        session.add(PostTag(post_id=post.id, tag_id=tag.id))

    session.commit()
    session.refresh(post)
    return enrich_post(post, session, current_user.id)


@router.get("/", response_model=list[PostRead])
def list_posts(
    skip: int = 0,
    limit: int = Query(default=20, le=100),
    tag: str | None = None,
    current_user: User | None = Depends(get_optional_user),
    session: Session = Depends(get_db),
):
    query = select(Post).order_by(Post.created_at.desc())

    if tag:
        tag_clean = tag.strip().lower().lstrip("#")
        query = (
            query
            .join(PostTag, PostTag.post_id == Post.id)
            .join(Tag, Tag.id == PostTag.tag_id)
            .where(Tag.name == tag_clean)
        )

    posts = session.exec(query.offset(skip).limit(limit)).all()
    user_id = current_user.id if current_user else None
    return [enrich_post(p, session, user_id) for p in posts]


@router.get("/tags", response_model=list[str])
def list_popular_tags(
    limit: int = Query(default=10, le=50),
    session: Session = Depends(get_db),
):
    post_tags = session.exec(select(PostTag)).all()
    counts: dict[int, int] = {}
    for pt in post_tags:
        counts[pt.tag_id] = counts.get(pt.tag_id, 0) + 1
    sorted_ids = sorted(counts, key=lambda tid: counts[tid], reverse=True)[:limit]
    tags = []
    for tid in sorted_ids:
        tag = session.get(Tag, tid)
        if tag:
            tags.append(f"#{tag.name}")
    return tags


@router.get("/saved", response_model=list[PostRead])
def list_saved_posts(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    posts = session.exec(
        select(Post)
        .join(Save, Save.post_id == Post.id)
        .where(Save.user_id == current_user.id)
        .order_by(Save.created_at.desc())
    ).all()
    return [enrich_post(p, session, current_user.id) for p in posts]


@router.get("/feed", response_model=list[PostRead])
def get_following_feed(
    skip: int = 0,
    limit: int = Query(default=20, le=100),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    follows = session.exec(select(Follow).where(Follow.follower_id == current_user.id)).all()
    following_ids = [f.following_id for f in follows]

    if not following_ids:
        return []

    posts = session.exec(
        select(Post)
        .where(Post.author_id.in_(following_ids))
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
    ).all()
    return [enrich_post(p, session, current_user.id) for p in posts]


@router.get("/explore", response_model=list[PostRead])
def get_explore_feed(
    skip: int = 0,
    limit: int = Query(default=20, le=100),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    follows = session.exec(select(Follow).where(Follow.follower_id == current_user.id)).all()
    excluded_ids = {f.following_id for f in follows}
    excluded_ids.add(current_user.id)

    posts = session.exec(
        select(Post)
        .where(Post.author_id.notin_(excluded_ids))
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
    ).all()
    return [enrich_post(p, session, current_user.id) for p in posts]


@router.get("/{post_id}", response_model=PostRead)
def get_post(
    post_id: int,
    current_user: User | None = Depends(get_optional_user),
    session: Session = Depends(get_db),
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Post não encontrado")
    return enrich_post(post, session, current_user.id if current_user else None)


@router.patch("/{post_id}", response_model=PostRead)
def update_post(
    post_id: int,
    data: PostUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Post não encontrado")
    if post.author_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Não podes editar este post")

    if data.content is not None:
        post.content = data.content

    if data.tags is not None:
        for pt in session.exec(select(PostTag).where(PostTag.post_id == post.id)).all():
            session.delete(pt)
        session.flush()
        for tag in get_or_create_tags(session, data.tags):
            session.add(PostTag(post_id=post.id, tag_id=tag.id))

    session.commit()
    session.refresh(post)
    return enrich_post(post, session, current_user.id)


@router.delete("/{post_id}", status_code=204)
def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Post não encontrado")
    if post.author_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Não podes apagar este post")

    for like in session.exec(select(Like).where(Like.post_id == post_id)).all():
        session.delete(like)
    for save in session.exec(select(Save).where(Save.post_id == post_id)).all():
        session.delete(save)
    for comment in session.exec(select(Comment).where(Comment.post_id == post_id)).all():
        session.delete(comment)
    for pt in session.exec(select(PostTag).where(PostTag.post_id == post_id)).all():
        session.delete(pt)
    for notif in session.exec(select(Notification).where(Notification.post_id == post_id)).all():
        session.delete(notif)

    session.delete(post)
    session.commit()
