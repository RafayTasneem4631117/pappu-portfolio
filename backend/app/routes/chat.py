"""POST /api/chat — Pappu answers a visitor's question using the RAG pipeline."""
import logging
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from app.config import get_settings
from app.rag.llm import LLMError
from app.rag.pipeline import KnowledgeBaseEmpty, answer
from app.routes.deps import rate_limit
from app.security.rate_limit import RateLimiter

log = logging.getLogger("chat")
router = APIRouter()

_limiter = RateLimiter(max_calls=get_settings().chat_rate_limit, window_seconds=60)


class Turn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=1500)


class ChatRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    message: str = Field(min_length=1, max_length=500)
    history: list[Turn] = Field(default_factory=list, max_length=12)


class ChatResponse(BaseModel):
    answer: str
    sources: list[str] = []
    mode: str = "rag"


# A normal "def" route: FastAPI runs it in a worker thread, so the slow
# embedding / LLM calls do not freeze the server.
@router.post(
    "/chat",
    response_model=ChatResponse,
    dependencies=[Depends(rate_limit(_limiter, "You’re sending messages too fast. Please wait a moment."))],
)
def chat(req: ChatRequest):
    try:
        return answer(req.message, [t.model_dump() for t in req.history])
    except KnowledgeBaseEmpty:
        raise HTTPException(503, "My knowledge base is empty. Run “python -m scripts.ingest” in the backend folder.")
    except LLMError as exc:
        log.error("LLM error: %s", exc)
        raise HTTPException(502, "My AI brain had a hiccup. Please try again in a moment.")
