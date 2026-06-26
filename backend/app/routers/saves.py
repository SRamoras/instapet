from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.database.database import get_db
from app.models import Post, Save, User
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/posts", tags=["Saves"])


@router.post("/{post_id}/save", status_code=201)
def save_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Post não encontrado")
    if session.get(Save, (current_user.id, post_id)):
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
