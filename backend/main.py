from contextlib import asynccontextmanager
from fastapi import FastAPI
from database import create_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    yield

app = FastAPI(title="instapet", lifespan=lifespan)


@app.get("/")
def root():
    return {"message": "PetNet 🐾"}