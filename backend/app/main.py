"""
Backend entry point.  Run from the backend folder with:

    uvicorn app.main:app --reload

API docs (auto-generated) are then at  http://localhost:8000/docs
"""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routes import chat, contact, health

logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(name)s: %(message)s")
settings = get_settings()

app = FastAPI(title="Pappu Portfolio API", version="1.0.0")

# Only your website may call this API from a browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(chat.router, prefix="/api", tags=["chatbot"])
app.include_router(contact.router, prefix="/api", tags=["contact"])
