from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, Header, status
from pydantic import BaseModel, Field
from app.services.chatter import get_chatter, models, DEFAULT_MODEL
from app.utils.token_manager import validate_token


router = APIRouter()

# Schema untuk validasi body
class ChatRequest(BaseModel):
    # query, model, dan temperature adalah field
    judul: str = Field(..., example="Catatan Aktivitas Nelayan")
    kategori: str = Field(..., example="Cumi-cumi, Senin, Pancing")
    catatan: str = Field(..., example="Cumi dapat 5 kg dari 10 pancingan di kapal motor, 5 jam di laut, kapalnnya sempat mogok, bensin solar 10 liter hampir habis")
    query: str = Field(..., example="Bisakah buatkan penjelasan catatan singkat tersebut menjadi beberapa paragraf?")
    model: Optional[str] = Field(
        None,
        description=f"Model untuk digunakan. Pilihan: {', '.join(models)}",
        example=DEFAULT_MODEL,
    )
    temperature: float = Field(
        default=0.8,
        ge=0,
        le=2,
        description="Nilai float antara 0 dan 2 untuk kontrol kreativitas model.",
        example=0.8,
    )

def get_token(authorization: str = Header(...)) -> str:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required."
        )

    # Tambahkan prefiks 'Bearer ' jika tidak ada
    if not authorization.startswith("Bearer "):
        authorization = f"Bearer {authorization}"
    
    token = authorization[7:]  # Mengambil token setelah 'Bearer '
    return token


@router.post("/")
async def generate_chat(
    chat_request: ChatRequest,
    chatter=Depends(get_chatter),
    token: str = Depends(get_token)
):
    try:
        # Validasi token sebelum melanjutkan
        validate_token(token)

        model = chat_request.model or DEFAULT_MODEL
        if model not in models:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid model. Available models: {', '.join(models)}"
            )

        response = chatter(
            judul=chat_request.judul,
            kategori=chat_request.kategori,
            catatan=chat_request.catatan,
            model=model,
            query=chat_request.query,
            temperature=chat_request.temperature,
        )

        return {
            "status": "success",
            "response": response,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )