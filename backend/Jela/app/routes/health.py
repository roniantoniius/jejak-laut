from fastapi import APIRouter
from app.redis.redis_connector import RedisTokenManager

router = APIRouter()

@router.get("/")
async def kondisi():
    return {
        "application": "Jela",
        "message": "Jela is running",
        "status": "healthy",
    }
redis_client = RedisTokenManager()

@router.get("/api/bot/ping")
async def ping():
    # Memeriksa apakah Redis terhubung dengan benar
    redis_connection = await redis_client.create_connection()
    pong = await redis_connection.ping()
    return {"message": pong}