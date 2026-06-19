from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select

from app.database.database import get_db
from app.models import Post, Tag, PostTag, Like, Save, Comment, User
from app.schemas.post import PostCreate, PostRead, PostUpdate
from app.schemas.comment import CommentCreate, CommentRead
from app.auth.dependencies import get_current_user, get_optional_user

router = APIRouter(prefix="/posts", tags=["Posts"])


# ── helpers ──────────────────────────────────────────
def _enrich_post(
    post: Post,
    session: Session,
    current_user_id: int | None = None
) -> PostRead:

    # ── AUTHOR ─────────────────────────────
    user = session.get(User, post.author_id)

    # ── TAGS ───────────────────────────────
    post_tags = session.exec(
        select(PostTag).where(PostTag.post_id == post.id)
    ).all()

    tag_names = []
    for pt in post_tags:
        tag = session.get(Tag, pt.tag_id)
        if tag:
            tag_names.append(tag.name)

    # ── LIKES ──────────────────────────────
    likes = session.exec(
        select(Like).where(Like.post_id == post.id)
    ).all()

    # ── SAVES ──────────────────────────────
    saves = session.exec(
        select(Save).where(Save.post_id == post.id)
    ).all()

    # ── COMMENTS ───────────────────────────
    comments = session.exec(
        select(Comment).where(Comment.post_id == post.id)
    ).all()

    # ── USER FLAGS ─────────────────────────
    liked_by_me = (
        any(l.user_id == current_user_id for l in likes)
        if current_user_id else False
    )

    saved_by_me = (
        any(s.user_id == current_user_id for s in saves)
        if current_user_id else False
    )

    # ── RESPONSE ───────────────────────────
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
    )

def _get_or_create_tags(session: Session, tag_names: list[str]) -> list[Tag]:
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


@router.post("/", response_model=PostRead, status_code=201)
def create_post(
    data: PostCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    post = Post(content=data.content, image_url=data.image_url, author_id=current_user.id)
    session.add(post)
    session.flush()

    tags = _get_or_create_tags(session, data.tags)
    for tag in tags:
        session.add(PostTag(post_id=post.id, tag_id=tag.id))

    session.commit()
    session.refresh(post)

    return _enrich_post(post, session, current_user.id)


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

    return [_enrich_post(p, session, user_id) for p in posts]

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
        .order_by(Post.created_at.desc())
    ).all()

    return [_enrich_post(post, session, current_user.id) for post in posts]
@router.get("/{post_id}", response_model=PostRead)
def get_post(
    post_id: int,
    current_user: User | None = Depends(get_optional_user),
    session: Session = Depends(get_db),
):
    post = session.get(Post, post_id)

    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Post não encontrado")

    user_id = current_user.id if current_user else None

    return _enrich_post(post, session, user_id)


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
        session.exec(select(PostTag).where(PostTag.post_id == post.id))
        existing = session.exec(select(PostTag).where(PostTag.post_id == post.id)).all()
        for pt in existing:
            session.delete(pt)
        session.flush()
        tags = _get_or_create_tags(session, data.tags)
        for tag in tags:
            session.add(PostTag(post_id=post.id, tag_id=tag.id))
    session.commit()
    session.refresh(post)
    return _enrich_post(post, session, current_user.id)


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
    session.delete(post)
    session.commit()


# ── Likes ────────────────────────────────────────────

@router.post("/{post_id}/like", status_code=201)
def like_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Post não encontrado")
    existing = session.get(Like, (current_user.id, post_id))
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Já deste like")
    session.add(Like(user_id=current_user.id, post_id=post_id))
    session.commit()
    return {"detail": "Like adicionado"}


@router.delete("/{post_id}/like", status_code=204)
def unlike_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    like = session.get(Like, (current_user.id, post_id))
    if not like:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Like não encontrado")
    session.delete(like)
    session.commit()


# ── Saves ────────────────────────────────────────────


@router.post("/{post_id}/save", status_code=201)
def save_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Post não encontrado")
    existing = session.get(Save, (current_user.id, post_id))
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Já guardaste este post")
    session.add(Save(user_id=current_user.id, post_id=post_id))
    session.commit()
    return {"detail": "Post guardado"}

@router.delete("/{post_id}/save", status_code=204)
def unsave_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    save = session.get(Save, (current_user.id, post_id))
    if not save:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Save não encontrado")
    session.delete(save)
    session.commit()





# ── Comments ─────────────────────────────────────────

@router.post("/{post_id}/comments", response_model=CommentRead, status_code=201)
def create_comment(
    post_id: int,
    data: CommentCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Post não encontrado")
    comment = Comment(content=data.content, author_id=current_user.id, post_id=post_id)
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return CommentRead(
        id=comment.id,
        content=comment.content,
        created_at=comment.created_at,
        author_id=comment.author_id,
        author_username=current_user.username,
        post_id=comment.post_id,
    )


@router.get("/{post_id}/comments", response_model=list[CommentRead])
def list_comments(
    post_id: int,
    session: Session = Depends(get_db),
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Post não encontrado")
    comments = session.exec(
        select(Comment).where(Comment.post_id == post_id).order_by(Comment.created_at)
    ).all()
    result = []
    for c in comments:
        author = session.get(User, c.author_id)
        result.append(CommentRead(
            id=c.id,
            content=c.content,
            created_at=c.created_at,
            author_id=c.author_id,
            author_username=author.username if author else None,
            author_avatar_url=author.avatar_url if author else None,
            post_id=c.post_id,
        ))
    return result


@router.delete("/{post_id}/comments/{comment_id}", status_code=204)
def delete_comment(
    post_id: int,
    comment_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    comment = session.get(Comment, comment_id)
    if not comment:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Comentário não encontrado")
    if comment.author_id != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Não podes apagar este comentário")
    session.delete(comment)
    session.commit()