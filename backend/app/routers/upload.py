from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.auth.dependencies import get_current_user
from app.models import User
import uuid

router = APIRouter(prefix="/upload", tags=["Upload"])

IMGS_DIR = Path(__file__).resolve().parent.parent.parent / "imgs"
MAX_SIZE  = 10 * 1024 * 1024  # 10 MB
ALLOWED   = {"image/jpeg", "image/png", "image/gif", "image/webp"}
EXT_MAP   = {"image/jpeg": "jpg", "image/png": "png", "image/gif": "gif", "image/webp": "webp"}


@router.post("/")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    if file.content_type not in ALLOWED:
        raise HTTPException(400, "Tipo de ficheiro não suportado. Usa JPEG, PNG, GIF ou WebP.")

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(413, "Ficheiro demasiado grande (máx. 10 MB).")

    ext      = EXT_MAP[file.content_type]
    filename = f"{uuid.uuid4()}.{ext}"

    IMGS_DIR.mkdir(exist_ok=True)
    (IMGS_DIR / filename).write_bytes(content)

    return {"url": f"http://localhost:8000/imgs/{filename}"}
