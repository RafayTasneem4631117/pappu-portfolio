"""
Central settings. Every secret / option comes from environment variables
(or the backend/.env file) — NOTHING is hard-coded in the source code.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # general
    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    trust_proxy: bool = False

    # LLM
    anthropic_api_key: str = ""
    llm_model: str = "claude-sonnet-5-5"
    llm_max_tokens: int = 450

    # RAG
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    knowledge_dir: str = "knowledge"
    chroma_dir: str = "chroma_db"
    top_k: int = 4
    max_distance: float = 0.75

    # email
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    contact_to_email: str = ""

    # spam protection
    chat_rate_limit: int = 20
    contact_rate_limit: int = 5
    min_form_fill_seconds: int = 3

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.frontend_origins.split(",") if o.strip()]

    @property
    def llm_configured(self) -> bool:
        return bool(self.anthropic_api_key)

    @property
    def email_configured(self) -> bool:
        return bool(self.smtp_user and self.smtp_password and self.contact_to_email)


@lru_cache
def get_settings() -> Settings:
    return Settings()
