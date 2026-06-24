from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database.database import get_db
from app.models.notification import Notification
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def list_notifications(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    notifs = session.exec(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(30)
    ).all()
    return [
        {
            "id": n.id,
            "type": n.type,
            "actor_username": n.actor_username,
            "post_id": n.post_id,
            "read": n.read,
            "created_at": n.created_at,
        }
        for n in notifs
    ]


@router.post("/read-all", status_code=204)
def mark_all_read(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    notifs = session.exec(
        select(Notification).where(Notification.user_id == current_user.id)
    ).all()
    for n in notifs:
        n.read = True
        session.add(n)
    session.commit()


@router.delete("/all", status_code=204)
def delete_all_notifications(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    notifs = session.exec(
        select(Notification).where(Notification.user_id == current_user.id)
    ).all()
    for n in notifs:
        session.delete(n)
    session.commit()
