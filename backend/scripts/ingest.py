"""
Rebuild the chatbot's knowledge base.

    cd backend
    python -m scripts.ingest
"""
from app.rag.ingest import run

if __name__ == "__main__":
    run(reset=True)
