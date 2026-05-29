from contextlib import asynccontextmanager
from fastapi import FastAPI
from database import create_db
from routers import auth, users, posts


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    yield


app = FastAPI(title="InstaPet", lifespan=lifespan)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(posts.router)


@app.get("/")
def root():
    return {"message": "InstaPet 🐾"}