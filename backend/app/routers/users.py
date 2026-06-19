from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database.database import get_db
from app.models.user import User
from app.models.follow import Follow
from app.models.post import Post
from app.models.like import Like
from app.schemas.user import UserRead, UserUpdate
from app.auth.dependencies import get_current_user, get_optional_user

router = APIRouter(prefix="/users", tags=["Users"])


def _enrich_user(user: User, session: Session, current_user_id: int | None = None) -> UserRead:
    follower_count  = len(session.exec(select(Follow).where(Follow.following_id == user.id)).all())
    following_count = len(session.exec(select(Follow).where(Follow.follower_id == user.id)).all())
    followed_by_me  = (
        session.get(Follow, (current_user_id, user.id)) is not None
        if current_user_id else False
    )
    user_posts = session.exec(select(Post).where(Post.author_id == user.id)).all()
    like_count = sum(
        len(session.exec(select(Like).where(Like.post_id == p.id)).all())
        for p in user_posts
    )
    return UserRead(
        **user.model_dump(),
        follower_count=follower_count,
        following_count=following_count,
        like_count=like_count,
        followed_by_me=followed_by_me,
    )


@router.get("/", response_model=list[UserRead])
def list_users(
    current_user: User | None = Depends(get_optional_user),
    session: Session = Depends(get_db),
):
    users = session.exec(select(User)).all()
    current_id = current_user.id if current_user else None
    return [
        _enrich_user(u, session, current_id)
        for u in users
        if u.id != current_id
    ]


@router.get("/me", response_model=UserRead)
def get_me(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    return _enrich_user(current_user, session, current_user.id)


@router.patch("/me", response_model=UserRead)
def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    for field, value in data.model_dump(exclude_unset=True).items():
        if value is None and field == 'display_name':
            continue
        setattr(current_user, field, value)
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return _enrich_user(current_user, session, current_user.id)


@router.get("/{username}", response_model=UserRead)
def get_user_by_username(
    username: str,
    current_user: User | None = Depends(get_optional_user),
    session: Session = Depends(get_db),
):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Utilizador não encontrado")
    return _enrich_user(user, session, current_user.id if current_user else None)


@router.post("/{username}/follow", status_code=201)
def follow_user(
    username: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Utilizador não encontrado")
    if user.id == current_user.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Não podes seguir-te a ti mesmo")
    if session.get(Follow, (current_user.id, user.id)):
        raise HTTPException(status.HTTP_409_CONFLICT, "Já segues este utilizador")
    session.add(Follow(follower_id=current_user.id, following_id=user.id))
    session.commit()
    return {"detail": "A seguir"}


@router.delete("/{username}/follow", status_code=204)
def unfollow_user(
    username: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Utilizador não encontrado")
    follow = session.get(Follow, (current_user.id, user.id))
    if not follow:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Não segues este utilizador")
    session.delete(follow)
    session.commit()