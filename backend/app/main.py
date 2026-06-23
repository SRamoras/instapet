from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database.database import create_db
from app.routers import auth, posts, users, upload

IMGS_DIR = Path(__file__).resolve().parent.parent / "imgs"
IMGS_DIR.mkdir(exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("CRIANDO BANCO...")
    create_db()
    yield


app = FastAPI(title="InstaPet", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/imgs", StaticFiles(directory=str(IMGS_DIR)), name="imgs")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(posts.router)
app.include_router(upload.router)


@app.get("/")
def root():
    return {"message": "InstaPet 🐾"}