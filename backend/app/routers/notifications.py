from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database.database import get_db
from app.models.notification import Notification
from app.schemas.notification import NotificationRead
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationRead])
def list_notifications(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_db),
):
    return session.exec(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(30)
    ).all()


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
