from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from app.schemas.auth import Token, LoginRequest
from app.auth.jwt import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserRead, status_code=201)
def register(data: UserCreate, session: Session = Depends(get_db)):
    existing = session.exec(
        select(User).where((User.email == data.email) | (User.username == data.username))
    ).first()
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Email ou username já existe")
    
    user = User(
        username=data.username,
        email=data.email,
        password=hash_password(data.password),
        display_name=data.display_name,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(data: LoginRequest, session: Session = Depends(get_db)):
    user = session.exec(select(User).where(User.email == data.email)).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Credenciais inválidas")
    return Token(access_token=create_access_token(user.id))