import uvicorn
from fastapi import FastAPI, Depends
from fastapi.security import APIKeyHeader
from app.routes import chat, health
from fastapi.middleware.cors import CORSMiddleware
from app.utils.token_manager import generate_token
from app.redis.redis_connector import RedisTokenManager


app = FastAPI(
    title="Jela Chatbot API",
    description="Microservice chatbot untuk mendampingi nelayan mencatat aktivitas di laut.",
    version="1.0.0",
)

API_KEY_HEADER = APIKeyHeader(name="Authorization", auto_error=True)

origins = ["http://localhost:5212"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Content-Type"]
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

@app.get("/ping")
async def ping():
    # Memeriksa apakah Redis terhubung dengan benar
    redis_connection = await redis_client.create_connection()
    pong = await redis_connection.ping()
    return {"message": pong}

@app.post("/generate_token")
async def generate_token_endpoint():
    token = await generate_token()  # Tambahkan 'await' di sini
    return {"token": token}

app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"], dependencies=[Depends(API_KEY_HEADER)])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5212, reload=True)