"""
STEP 3 of RAG — the vector database (ChromaDB).

It stores every chunk together with its embedding on disk (folder chroma_db/)
and can quickly answer: "which chunks are closest in meaning to this question?"
"""
from functools import lru_cache

from app.config import get_settings
from app.rag.chunking import Chunk

COLLECTION = "portfolio"


@lru_cache
def _client():
    import chromadb

    return chromadb.PersistentClient(path=get_settings().chroma_dir)


def _collection():
    # cosine distance: 0 = identical meaning, bigger = less related
    return _client().get_or_create_collection(COLLECTION, metadata={"hnsw:space": "cosine"})


def reset() -> None:
    """Delete everything (used before a fresh ingest)."""
    try:
        _client().delete_collection(COLLECTION)
    except Exception:
        pass


def add(chunks: list[Chunk], embeddings: list[list[float]]) -> None:
    ids = [f"{c.source}::{c.index}" for c in chunks]
    _collection().upsert(
        ids=ids,
        documents=[c.text for c in chunks],
        embeddings=embeddings,
        metadatas=[{"source": c.source, "heading": c.heading} for c in chunks],
    )


def count() -> int:
    return _collection().count()


def search(query_embedding: list[float], k: int) -> list[dict]:
    res = _collection().query(query_embeddings=[query_embedding], n_results=k)
    out = []
    for doc, meta, dist in zip(res["documents"][0], res["metadatas"][0], res["distances"][0]):
        out.append({"text": doc, "source": meta["source"], "heading": meta["heading"], "distance": dist})
    return out
