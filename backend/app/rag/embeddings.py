"""
STEP 2 of RAG — embeddings.

An embedding turns a piece of text into a list of numbers that captures its
MEANING. Texts with similar meaning get similar numbers, so we can search by
meaning instead of exact words.

We use the free "sentence-transformers" model (runs on your own computer; it
is downloaded once, ~90 MB, the first time you run it).
"""
from functools import lru_cache

from app.config import get_settings


@lru_cache
def _model():
    # imported here so that simply starting the server stays fast
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(get_settings().embedding_model)


def embed(texts: list[str]) -> list[list[float]]:
    vectors = _model().encode(texts, normalize_embeddings=True, show_progress_bar=False)
    return [v.tolist() for v in vectors]
