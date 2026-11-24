# Pappu Portfolio — Design and Development of an Interactive 3D Web Portfolio
**Syed Abdul Rafay Tasneem**

A one-page, hand-drawn portfolio (React + Vite) with **Pappu**, a RAG chatbot mascot (FastAPI + ChromaDB + Claude), interactive hover effects, a project gallery, a video section, a contact form with real email delivery, and a slot for a Blender-made 3D avatar.

```
portfolio/
  frontend/        React + Vite website
  backend/         FastAPI: chatbot (RAG) + contact form
  assets/          pappu/ doodles/ projects/ video/ avatar/   (served as the site's public folder)
  blender/         your .blend file goes here
  documentation/   ARCHITECTURE.md, CUSTOMIZING.md, BLENDER_GUIDE.md, design-reference.jpg
  report/          REPORT_OUTLINE.md
```

## 1. What you need installed
- **Node.js 18+** → https://nodejs.org (check: `node -v`)
- **Python 3.10+** → https://python.org (check: `python --version`)

## 2. Run the website (frontend)
```bash
cd frontend
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run dev
```
Open **http://localhost:5173**. The page, hover effects, project windows and video placeholder work already. The chatbot and contact form need the backend (next step).

## 3. Run the backend
Open a **second** terminal:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt    # downloads a lot the first time (a few minutes)
cp .env.example .env               # Windows: copy .env.example .env
```
Edit `backend/.env` (see sections 4 and 5), then:
```bash
python -m scripts.ingest           # builds Pappu's knowledge base (first run downloads a ~90 MB model)
uvicorn app.main:app --reload
```
Check **http://localhost:8000/api/health** — it shows whether the AI key, email and knowledge base are set up. Interactive API docs: http://localhost:8000/docs

## 4. Turn on Pappu's AI answers
1. Create an API key at https://console.anthropic.com
2. Put it in `backend/.env` → `ANTHROPIC_API_KEY=...`
3. Restart `uvicorn`.

Without a key Pappu still replies in *retrieval-only* mode (quotes the best matching note).

**Teaching Pappu about you:** edit the Markdown files in `backend/knowledge/` (about, skills, experience, achievements, `projects/…`), then run `python -m scripts.ingest` again. Fill in **only true facts** — Pappu repeats exactly what is there. Files currently say "not added yet" where I did not have your information.

## 5. Make the contact form send you emails
In `backend/.env` set `SMTP_USER`, `SMTP_PASSWORD`, `CONTACT_TO_EMAIL`.
For Gmail: turn on 2-Step Verification, create an **App password** (https://myaccount.google.com/apppasswords) and use it as `SMTP_PASSWORD` (not your normal password).
Never commit `.env`; it is git-ignored.

## 6. Add your own content
| What | Where |
|---|---|
| Texts, email, video path | `frontend/src/data/site.js` |
| Projects (cards + their PDFs) | `frontend/src/data/projects.js`; files in `assets/projects/<id>/` (`cover.jpg` + `project.pdf`) |
| Skills labels | `frontend/src/data/skills.js` |
| Education / experience | `frontend/src/data/education.js` |
| Your video | `assets/video/promo.mp4` |
| 3D avatar | `assets/avatar/avatar.glb` — see `documentation/BLENDER_GUIDE.md` |

More in `documentation/CUSTOMIZING.md`.

## 7. Honest status (what is real, what is placeholder)
✅ Built: full page from your design, Pappu click → chatbot, RAG pipeline, contact form + SMTP, skill & card 3D hover, project cards that open each project's PDF in an on-page viewer window, MP4 player, responsive layout, reduced-motion support, GLB viewer with fallback.
⬜ **Placeholders you must fill:** the five project PDFs (`assets/projects/<id>/project.pdf` — the viewer shows a friendly message until its PDF exists); `promo.mp4`; knowledge-base details beyond what is in your design; the Blender model (**not created** — no `.blend`/`.glb` exists yet).
⚠ Font: your design uses *Letter-O-Matic BB* (a commercial font). The site uses free **Bangers** + **Comic Neue** as a close stand-in. If you own the font, add a web-font at `assets/fonts/LetterOMatic.woff2` and it is used automatically.
⚠ The text in your design says "alot" — it is copied as-is in `site.js`; fix it there if you want "a lot".

## 8. Build for production
```bash
cd frontend && npm run build      # output in frontend/dist
```
Host `dist/` on any static host (Netlify, Vercel, GitHub Pages) and deploy `backend/` to a Python host (Render, Railway, a VPS). Then set `VITE_API_URL` (frontend) and `FRONTEND_ORIGINS` (backend) to your real domains.

## 9. Troubleshooting
| Problem | Fix |
|---|---|
| Chat says "can't reach my brain" | backend not running — start `uvicorn`, or check `VITE_API_URL` |
| "My knowledge base is empty" | run `python -m scripts.ingest` |
| Contact form says "isn't set up" | fill the `SMTP_*` / `CONTACT_TO_EMAIL` values and restart |
| Pappu says "AI brain isn't connected" | add `ANTHROPIC_API_KEY` |
| Gmail login fails | use an App password, not your normal password |
| Tests | `cd backend && python -m pytest -q` |
