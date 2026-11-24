"""Shared FastAPI dependencies (rate limiting by visitor IP)."""
from fastapi import HTTPException, Request

from app.config import get_settings
from app.security.rate_limit import RateLimiter


def client_ip(request: Request) -> str:
    settings = get_settings()
    if settings.trust_proxy:
        fwd = request.headers.get("x-forwarded-for")
        if fwd:
            return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limit(limiter: RateLimiter, message: str):
    """Build a dependency that answers 429 when a visitor sends too much."""

    def dependency(request: Request):
        if not limiter.allow(client_ip(request)):
            raise HTTPException(status_code=429, detail=message)

    return dependency
