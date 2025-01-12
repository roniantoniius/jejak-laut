import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import APIKeyHeader
from app.routes import chat, health
from fastapi.middleware.cors import CORSMiddleware
from app.utils.token_manager import generate_token
from app.redis.redis_connector import RedisTokenManager


app = FastAPI(
    title="Jela",
    description="Microservice chatbot untuk mendampingi nelayan mencatat aktivitas di laut adalah Jela.",
    version="1.5.1",
)

API_KEY_HEADER = APIKeyHeader(name="Authorization", auto_error=True)
            # punya web              # gatauu punya siapa      # punya expo native
origins = [
    "http://localhost:5173", 
    "http://localhost:8081", 
    "exp://192.168.100.6:8081",
    "http://192.168.100.6:19000",  # Metro Bundler default
    "http://192.168.100.6:19001",  # Expo web client
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def add_security_to_openapi():
    if app.openapi_schema:
        for path in app.openapi_schema.get("paths", {}).values():
            for method in path.values():
                if "security" not in method:
                    method["security"] = [{"Authorization": []}]

app.add_event_handler("startup", add_security_to_openapi)

redis_client = RedisTokenManager()

@app.on_event("startup")
async def startup():
    # Membuat koneksi Redis saat aplikasi mulai
    await redis_client.create_connection()

@app.post("/api/session/redis/generate_token")
async def generate_token_endpoint():
    token = await generate_token()  # Tambahkan 'await' di sini
    return {"token": token}

# Latest token yang secara global (user apapun bisa akses)
@app.get("/api/session/redis/latest_token")
async def get_latest_token():
    token_terbaru = await redis_client.get_latest_token()
    if not token_terbaru:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tidak ada token yang ditemukan!"
        )
    return {"token_terbaru": token_terbaru}

app.include_router(health.router, prefix="/api/jela/health", tags=["Jela's Health Check and Token Generator"])
app.include_router(chat.router, prefix="/api/jela/chat", tags=["Jela's Respons API"], dependencies=[Depends(API_KEY_HEADER)])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5212, reload=True)