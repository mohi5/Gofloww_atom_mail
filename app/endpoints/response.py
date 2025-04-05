from fastapi import APIRouter, Request, HTTPException, Body
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.services.email_service import generate_response
from pydantic import BaseModel

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

class GenerateRequest(BaseModel):
    thread: str

@router.post("/generate-response")
@limiter.limit("10/minute")
async def generate_response_endpoint(
    request: Request, 
    generate_request: GenerateRequest = Body(...)
):
    try:
        user_style = "professional"
        response = await generate_response(generate_request.thread, user_style)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))