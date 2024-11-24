from fastapi import FastAPI, Depends
from fastapi.security import APIKeyHeader
from fastapi.openapi.models import APIKey

from app.routes import chat, health
from app.utils.token_manager import generate_token

app = FastAPI(
    title="Jela Chatbot API",
    description="Microservice chatbot untuk mendampingi nelayan mencatat aktivitas di laut.",
    version="1.0.0",
)

# Tambahkan APIKeyHeader untuk Swagger UI
API_KEY_HEADER = APIKeyHeader(name="Authorization", auto_error=True)

@app.on_event("startup")
def configure_openapi():
    if app.openapi_schema:
        for path in app.openapi_schema.get("paths", {}).values():
            for method in path.values():
                security = [{"Authorization": []}]
                if "security" not in method:
                    method["security"] = security

@app.post("/generate_token")
async def generate_new_token():
    token = generate_token()
    return {"token": token}  # Tetap murni tanpa 'Bearer'

# Sertakan routes
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"], dependencies=[Depends(API_KEY_HEADER)])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=5212, reload=True)
