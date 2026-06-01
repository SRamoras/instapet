from sqlmodel import SQLModel, Session, create_engine

DATABASE_URL = "sqlite:///./instapet.db"

engine = create_engine(DATABASE_URL, echo=True, connect_args={"check_same_thread": False})

def create_db():
    SQLModel.metadata.create_all(engine)

def get_db():
    with Session(engine) as session:
        yield session