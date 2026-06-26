from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.database.database import get_db
from app.models import Post, Like, Notification, User
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/posts", tags=["Likes"])


@router.post("/{post_id}/like", status_code=201)
def like_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Post não encontrado")
    if session.get(Like, (current_user.id, post_id)):
        raise HTTPException(status.HTTP_409_CONFLICT, "Já deste like")
    session.add(Like(user_id=current_user.id, post_id=post_id))
    if post.author_id != current_user.id:
        session.add(Notification(
            user_id=post.author_id,
            actor_username=current_user.username,
            type="like",
            post_id=post_id,
        ))
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
