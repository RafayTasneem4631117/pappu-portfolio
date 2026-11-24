"""
THE RAG PIPELINE — what happens for every chat message:

  question ──► embed ──► search vector DB ──► top chunks (the "context")
                                                    │
        Pappu persona + context + question + chat history
                                                    ▼
                                                  LLM  ──► answer

"Retrieval-Augmented Generation" = we RETRIEVE facts from your knowledge base and
let the LLM GENERATE an answer using only those facts.
"""
from app.config import get_settings
from app.rag import vectorstore
from app.rag.embeddings import embed
from app.rag.llm import LLMNotConfigured, generate
from app.rag.persona import NO_CONTEXT, SYSTEM_PROMPT


class KnowledgeBaseEmpty(Exception):
    """Nothing has been ingested yet (run `python -m scripts.ingest`)."""


def retrieve(question: str) -> list[dict]:
    s = get_settings()
    if vectorstore.count() == 0:
        raise KnowledgeBaseEmpty()
    hits = vectorstore.search(embed([question])[0], s.top_k)
    return [h for h in hits if h["distance"] <= s.max_distance]  # drop weak matches


def build_user_message(question: str, hits: list[dict]) -> str:
    context = "\n\n---\n\n".join(f"[{h['source']}]\n{h['text']}" for h in hits) or NO_CONTEXT
    return f"<context>\n{context}\n</context>\n\nVisitor's message: {question}"


def answer(question: str, history: list[dict]) -> dict:
    hits = retrieve(question)

    # Retrieval-only fallback: works even before you add an API key.
    if not get_settings().llm_configured:
        if not hits:
            text = "Hmm, I don't know that one! (My AI brain isn't connected yet, so I can only search my notes.)"
        else:
            text = "My AI brain isn't connected yet, but here's what my notes say:\n\n" + hits[0]["text"]
        return {"answer": text, "sources": sorted({h["source"] for h in hits}), "mode": "retrieval-only"}

    messages = [{"role": m["role"], "content": m["content"]} for m in history[-8:]]
    messages.append({"role": "user", "content": build_user_message(question, hits)})
    # The API requires the first message to be from the user
    while messages and messages[0]["role"] != "user":
        messages.pop(0)

    text = generate(SYSTEM_PROMPT, messages)
    return {"answer": text, "sources": sorted({h["source"] for h in hits}), "mode": "rag"}
