from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def kondisi():
    return {
        "application": "Jela",
        "message": "Jela is running",
        "status": "healthy",
    }
