from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database.database import get_db
from app.models import Post, Comment, Notification, User
from app.schemas.comment import CommentCreate, CommentRead
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/posts", tags=["Comments"])


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
    if post.author_id != current_user.id:
        session.add(Notification(
            user_id=post.author_id,
            actor_username=current_user.username,
            type="comment",
            post_id=post_id,
        ))
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
