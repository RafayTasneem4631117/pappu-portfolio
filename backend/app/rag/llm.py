"""
STEP 5 of RAG — the LLM (large language model).

This file is the ONLY place that talks to the AI provider (Claude via the
Anthropic API). To use another provider (OpenAI, Gemini, a local model…)
you only need to change the `generate` function here.
"""
from functools import lru_cache

from app.config import get_settings


class LLMNotConfigured(Exception):
    """No ANTHROPIC_API_KEY in backend/.env"""


class LLMError(Exception):
    """The AI provider returned an error."""


@lru_cache
def _client():
    import anthropic

    return anthropic.Anthropic(api_key=get_settings().anthropic_api_key, timeout=30.0)


def generate(system: str, messages: list[dict]) -> str:
    s = get_settings()
    if not s.llm_configured:
        raise LLMNotConfigured()
    try:
        response = _client().messages.create(
            model=s.llm_model,
            max_tokens=s.llm_max_tokens,
            system=system,
            messages=messages,
        )
    except Exception as exc:  # network error, bad key, rate limit …
        raise LLMError(str(exc)) from exc
    return "".join(block.text for block in response.content if getattr(block, "type", "") == "text").strip()
