"""POST /api/contact — validates the form and emails it to you."""
import logging

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.config import get_settings
from app.routes.deps import rate_limit
from app.security.rate_limit import RateLimiter
from app.security.spam import is_spam
from app.services.email import EmailNotConfigured, EmailSendError, send_contact_email

log = logging.getLogger("contact")
router = APIRouter()

_limiter = RateLimiter(max_calls=get_settings().contact_rate_limit, window_seconds=3600)


class ContactRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=150)
    message: str = Field(min_length=10, max_length=5000)
    website: str = ""        # honeypot (must stay empty)
    elapsed_ms: int = 0      # how long the form was open (set by the frontend)


@router.post(
    "/contact",
    dependencies=[Depends(rate_limit(_limiter, "Too many messages. Please try again later."))],
)
def contact(data: ContactRequest):
    settings = get_settings()

    if is_spam(data.website, data.elapsed_ms, data.message, settings.min_form_fill_seconds):
        log.info("Spam submission silently dropped")
        return {"ok": True}  # pretend success so bots learn nothing

    try:
        send_contact_email(data.name, data.email, data.subject, data.message)
    except EmailNotConfigured:
        raise HTTPException(503, "The contact form isn’t set up on the server yet.")
    except EmailSendError as exc:
        log.error("SMTP error: %s", exc)  # details stay in the server log only
        raise HTTPException(502, "Couldn’t send your message right now. Please email me directly.")
    return {"ok": True}
