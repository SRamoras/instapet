from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import create_db
from app.routers import auth, posts
from app.routers import users


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("CRIANDO BANCO...")
    create_db()
    yield


app = FastAPI(title="InstaPet", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(posts.router)


@app.get("/")
def root():
    return {"message": "InstaPet 🐾"}