# Architecture

```
Browser (React + Vite)                         Server (FastAPI)
┌──────────────────────────┐   POST /api/chat   ┌────────────────────────────┐
│ App.jsx                  │ ─────────────────► │ routes/chat.py             │
│  ├─ Hero (+ AvatarViewer)│                    │   └─ rag/pipeline.py       │
│  ├─ About (Pappu button) │                    │        ├─ embeddings.py    │
│  ├─ Skills (SkillTag)    │                    │        ├─ vectorstore.py ──┼─► chroma_db/ (on disk)
│  ├─ Projects (+PDF view) │                    │        ├─ persona.py       │
│  ├─ VideoSection         │                    │        └─ llm.py ──────────┼─► Claude API
│  ├─ Education            │  POST /api/contact │ routes/contact.py          │
│  ├─ Contact              │ ─────────────────► │   ├─ security/spam.py      │
│  └─ ChatWidget           │                    │   └─ services/email.py ────┼─► SMTP → your inbox
└──────────────────────────┘                    └────────────────────────────┘
```

## Folder map
| Folder | What lives there |
|---|---|
| `frontend/src/components/sections` | one file per page section |
| `frontend/src/components/chatbot` | chat window UI (`ChatWidget`) + logic (`useChat`) — separate from the page |
| `frontend/src/components/avatar` | Three.js avatar viewer |
| `frontend/src/data` | **editable content**: `site.js`, `skills.js`, `projects.js`, `education.js` |
| `frontend/src/styles` | all CSS: `global`, `sections`, `effects` (hover/3D), `chatbot`, `project-pdf-modal` |
| `frontend/src/hooks/useTilt.js` | the pointer-tilt effect used by skills and project cards |
| `frontend/src/components/sections/ProjectPDFModal.jsx` | the on-page PDF viewer (iframe) opened by the project cards |
| `frontend/src/utils/pdfCheck.js` | checks a PDF file really exists before showing it |
| `frontend/src/api/client.js` | the only file that calls the backend |
| `backend/app/routes` | API endpoints (`chat`, `contact`, `health`) |
| `backend/app/rag` | the RAG pipeline, one file per step |
| `backend/app/security` | rate limiting + spam checks (pure Python, unit-tested) |
| `backend/app/services` | email sending |
| `backend/knowledge` | **your chatbot's knowledge** (Markdown files) |
| `assets/` | all images, video and the GLB (served by Vite as the public folder) |

## The RAG pipeline step by step
1. **Ingest** (`python -m scripts.ingest`): read `knowledge/**/*.md` → **chunk** (`chunking.py`) → **embed** (`embeddings.py`, sentence-transformers) → **store** (`vectorstore.py`, ChromaDB).
2. **Ask**: visitor message → embed the question → find the `TOP_K` closest chunks → drop chunks further than `MAX_DISTANCE`.
3. **Generate**: Pappu's rules (`persona.py`) + retrieved chunks + last 8 messages → LLM (`llm.py`).
4. **Honesty**: the prompt forbids using anything outside the retrieved context, and the knowledge files say "not added yet" where details are missing, so Pappu says "I don't know" instead of guessing.
5. **No API key?** The pipeline falls back to *retrieval-only* mode (shows the best matching note) so the chatbot still works while you set things up.

## Security measures
- Secrets only in `backend/.env` (git-ignored). The frontend only knows `VITE_API_URL`.
- CORS limited to `FRONTEND_ORIGINS`.
- Input validation with Pydantic (lengths, email format) on top of browser validation.
- Rate limits per IP (chat: per minute, contact: per hour).
- Contact spam: hidden honeypot field, minimum fill time, link-stuffing check; bots get a fake "ok".
- Email header injection prevented (`clean_header`); visitor email goes in `Reply-To`, never `From`.
- Prompt-injection defence: context and visitor text are labelled as data in the system prompt.

## Changes from the suggested stack (and why)
- **Three.js directly instead of React Three Fiber** — fewer packages and concepts for a beginner; the avatar is one component of ~100 lines. R3F can replace it later without touching anything else.
- **CSS only instead of Framer Motion** — the hover/tilt effects need only CSS variables and a 70-line hook; one dependency less, and `prefers-reduced-motion` is trivial to honour.
- **`cqw` (container query units) for sizing** — the layout scales exactly like the Illustrator artboard; mobile uses a re-arranged layout below 720 px.
- **Anthropic SDK for the LLM** — isolated in `llm.py`, swap the one function for another provider if you like.

## Known limitations
- The rate limiter is in-memory (fine for one server process).
- Fonts: your design uses *Letter-O-Matic BB* (commercial). The site uses free Bangers + Comic Neue unless you add a licensed web-font (see `global.css`).
- Project detail content (logos, colours, typography, screenshots) are placeholders until you add them.
