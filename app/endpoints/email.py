from fastapi import APIRouter, HTTPException
from app.models.requests import EmailRequest
from app.chains.composition import composition_chain
from app.chains.refinement import refinement_chain
from app.services.email_service import process_email_for_privacy

router = APIRouter()

@router.post("/generate-email")
async def generate_email(request: EmailRequest):
    try:
        clean_context = process_email_for_privacy(request.context)
        email = composition_chain.invoke({
            "key_points": request.prompt,
            "tone": request.preferences.get("tone", "professional"),
            "recipient_info": clean_context,
            "history": ""
        })
        return {"email": email}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refine-email")
async def refine_email(draft: str, feedback: str):
    try:
        return refinement_chain.invoke({
            "draft": draft,
            "feedback": feedback
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))