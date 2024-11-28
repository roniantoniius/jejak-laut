from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, Header, status
from pydantic import BaseModel
from fastapi.logger import logger
from app.services.chatter import models, DEFAULT_MODEL, get_chatter
from app.utils.token_manager import validate_token
from fastapi import WebSocket, WebSocketDisconnect
from app.services.chat_service import process_chat

router = APIRouter()

class ChatRequest(BaseModel):
    judul: str
    kategori: str
    catatan: str
    query: str
    model: Optional[str] = DEFAULT_MODEL
    temperature: float = 0.82

def get_token(authorization: str = Header(...)) -> str:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is required."
        )
    if not authorization.startswith("Bearer "):
        authorization = f"Bearer {authorization}"
    return authorization[7:]

@router.post("/")
async def generate_chat(chat_request: ChatRequest, token: str = Depends(get_token)):
    validate_token(token)

    model = chat_request.model or DEFAULT_MODEL
    if model not in models:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid model. Available models: {', '.join(models)}"
        )

    try:
        start_time = datetime.now()
        response = process_chat(chat_request)

        end_time = datetime.now()
        end_time_str = end_time.strftime("%Y-%m-%d %H:%M:%S")
        elapsed_time = (end_time - start_time).total_seconds()
        logger.info(
            f"[{end_time_str}] Request processed: {chat_request.dict()} | "
            f"Response: {response} | Time taken: {elapsed_time:.2f} seconds"
        )

        return {"status": "success", "response": response}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    chatter = get_chatter()  # Perbaikan: gunakan get_chatter
    try:
        while True:
            message = await websocket.receive_text()
            response = chatter(query=message)
            await websocket.send_text(response["response"])
    except WebSocketDisconnect:
        print("Client disconnected")