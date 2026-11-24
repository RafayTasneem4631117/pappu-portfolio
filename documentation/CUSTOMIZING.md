# How to edit things

| I want to… | Edit |
|---|---|
| change a text (about, headings, email) | `frontend/src/data/site.js` |
| add / remove a skill label, move it | `frontend/src/data/skills.js` |
| add / remove a project | `frontend/src/data/projects.js` + images in `assets/projects/<id>/` |
| add a school / job | `frontend/src/data/education.js` |
| replace the video | put `promo.mp4` in `assets/video/` |
| change colours / font sizes | variables at the top of `frontend/src/styles/global.css` |
| change hover strength | `useTilt({ maxTilt })` in `SkillTag.jsx` / `ProjectCard.jsx`; glow in `styles/effects.css` |
| teach Pappu something new | add/edit a `.md` file in `backend/knowledge/`, then `python -m scripts.ingest` |
| change Pappu's personality | `backend/app/rag/persona.py` |
| change who receives contact emails | `CONTACT_TO_EMAIL` in `backend/.env` |

## Adding or replacing a project PDF
Each project card opens its own PDF in a viewer window ON the page (it uses the browser's built-in PDF viewer inside an iframe; no new tab).
- **Replace a PDF:** copy your new file into `assets/projects/<id>/` with the name `project.pdf` (overwrite the old one). Refresh the page — done.
- **Different file name?** Open `frontend/src/data/projects.js` and change that project's `pdf:` line, e.g. `pdf: '/projects/hyperon/Hyperon-Brand-Guide.pdf'`.
- **Avoid spaces** in file names (use `-`), e.g. `Hyperon-Brand-Guide.pdf`.
- **Missing file?** The viewer window shows "The … PDF isn't available yet" instead of an empty page.

## Adding a new project
1. Create `assets/projects/my-app/` and put `cover.jpg` (card image) and `project.pdf` in it.
2. In `projects.js` copy a project block and set `id: 'my-app'`, `title`, `cover: '/projects/my-app/cover.jpg'`, `pdf: '/projects/my-app/project.pdf'`.
3. Create `backend/knowledge/projects/my-app.md` describing it truthfully, then run `python -m scripts.ingest` so Pappu knows about it.
