"""
THE INGESTION PIPELINE — reads your knowledge files and fills the vector database.

Run it whenever you change anything inside backend/knowledge/ :

    cd backend
    python -m scripts.ingest
"""
from pathlib import Path

from app.config import get_settings
from app.rag import vectorstore
from app.rag.chunking import Chunk, chunk_markdown
from app.rag.embeddings import embed

ALLOWED = {".md", ".txt"}


def load_chunks(knowledge_dir: Path) -> list[Chunk]:
    """Read every .md / .txt file (files starting with "_" are templates and skipped)."""
    chunks: list[Chunk] = []
    for path in sorted(knowledge_dir.rglob("*")):
        if path.suffix.lower() not in ALLOWED or path.name.startswith("_"):
            continue
        rel = path.relative_to(knowledge_dir).as_posix()
        chunks.extend(chunk_markdown(path.read_text(encoding="utf-8"), source=rel))
    return chunks


def run(reset: bool = True) -> int:
    settings = get_settings()
    folder = Path(settings.knowledge_dir)
    if not folder.exists():
        raise SystemExit(f"Knowledge folder not found: {folder.resolve()}")

    chunks = load_chunks(folder)
    if not chunks:
        raise SystemExit("No knowledge files found — add .md files to the knowledge folder.")

    print(f"Read {len(chunks)} chunks from {folder}/ — creating embeddings (first run downloads the model)…")
    vectors = embed([c.text for c in chunks])

    if reset:
        vectorstore.reset()
    vectorstore.add(chunks, vectors)
    print(f"Done! {vectorstore.count()} chunks are now in the vector database ({settings.chroma_dir}/).")
    return len(chunks)
