import redis
import uuid
from datetime import timedelta
from fastapi import HTTPException, status
from time import time

# Koneksi ke Redis
redis_client = redis.Redis(host='localhost', port=6380, db=0)

# Waktu habis token (30 menit)
TOKEN_EXPIRATION_TIME = timedelta(minutes=30)

# Maksimal penggunaan token
MAX_USE_COUNT = 5

def generate_token() -> str:
    # Menghasilkan token unik
    token = str(uuid.uuid4())
    
    # Set token di Redis dengan expire 30 menit
    redis_client.setex(f"token:{token}", TOKEN_EXPIRATION_TIME, 0)  # 0 adalah jumlah penggunaan awal
    return token

def validate_token(token: str) -> bool:
    # Memeriksa apakah token ada
    if not redis_client.exists(f"token:{token}"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token."
        )
    
    # Mengambil jumlah penggunaan token
    usage_count = int(redis_client.get(f"token:{token}"))
    
    # Memeriksa apakah token sudah melebihi batas penggunaan
    if usage_count >= MAX_USE_COUNT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token usage exceeded."
        )
    
    # Mengupdate penggunaan token
    redis_client.incr(f"token:{token}")
    return True
