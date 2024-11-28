import uuid
from datetime import timedelta
from fastapi import HTTPException, status
from app.redis.redis_connector import RedisTokenManager

redis_client = RedisTokenManager()

# Waktu habis token (30 menit)
TOKEN_EXPIRATION_TIME = 30 * 60  # Dalam detik

# Maksimal penggunaan token
MAX_USE_COUNT = 5

async def generate_token() -> str:
    token = str(uuid.uuid4())
    await redis_client.set_token(f"token:{token}", 0, TOKEN_EXPIRATION_TIME)  # 0 sebagai penggunaan awal
    return token

async def validate_token(token: str) -> bool:
    key = f"token:{token}"
    usage_count = await redis_client.get_token(key)

    if usage_count is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token."
        )
    usage_count = int(usage_count)

    if usage_count >= MAX_USE_COUNT:
        await redis_client.delete_token(key)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token usage exceeded."
        )

    # Increment penggunaan token
    await redis_client.set_token(key, usage_count + 1, TOKEN_EXPIRATION_TIME)
    return True
