"""GET /api/health — quick status check (handy while setting things up)."""
from fastapi import APIRouter

from app.config import get_settings

router = APIRouter()


@router.get("/health")
def health():
    s = get_settings()
    chunks = None
    try:
        from app.rag import vectorstore

        chunks = vectorstore.count()
    except Exception:
        pass
    return {
        "status": "ok",
        "llm_configured": s.llm_configured,
        "email_configured": s.email_configured,
        "knowledge_chunks": chunks,
    }
