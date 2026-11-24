# Academic Project Report — Outline
**Design and Development of an Interactive 3D Web Portfolio**
Syed Abdul Rafay Tasneem — BS CSIT (Gaming Animation), NED University

1. **Abstract** (150–250 words)
2. **Introduction** — motivation, problem statement, objectives, scope
3. **Literature / Background Review** — portfolio websites, interactive web design, 3D on the web (WebGL/Three.js), chatbots and Retrieval-Augmented Generation
4. **Requirements Analysis** — functional (sections, chatbot, gallery, video, contact form, avatar), non-functional (responsive, accessible, performance, security), user personas
5. **Design**
   - 5.1 Visual identity & the Illustrator design (include `documentation/design-reference.jpg`)
   - 5.2 Pappu — character design process
   - 5.3 Interaction design (tilt/hover, project cards opening PDF portfolios, chat)
   - 5.4 3D avatar: concept art, modelling in Blender, export pipeline
6. **System Architecture** — diagram from `ARCHITECTURE.md`, technology choices and justification
7. **Implementation**
   - 7.1 Frontend (components, CSS strategy, `useTilt`, responsiveness)
   - 7.2 Backend API (FastAPI routes, validation)
   - 7.3 RAG pipeline (chunking, embeddings, ChromaDB, prompt design, anti-hallucination measures)
   - 7.4 Contact form & email delivery
   - 7.5 Three.js / GLB integration
8. **Security & Privacy** — secrets management, rate limiting, spam protection, CORS, data handled by the chatbot
9. **Testing & Evaluation**
   - Unit tests (`backend/tests`), manual test checklist (below), cross-browser/device results
   - Chatbot evaluation: a table of ~20 test questions, expected vs actual answers, hallucination rate
   - Accessibility (keyboard, reduced motion, contrast), performance (Lighthouse scores)
10. **Results & Discussion** — screenshots, limitations, challenges
11. **Conclusion & Future Work** — CMS for projects, analytics, voice for Pappu, rigged/animated avatar
12. **References** (IEEE/APA)
13. **Appendices** — folder structure, API reference (`/docs`), user guide, source-code excerpts

## Manual test checklist
- [ ] Page matches the design at 1440 px, 1024 px, 768 px, 390 px
- [ ] Clicking the first Pappu opens the chat; Esc / ✕ closes it
- [ ] Chat answers match `knowledge/`; unknown questions → "I don't know"
- [ ] Skills tilt/glow on hover; tap highlight on a phone
- [ ] Project cards tilt/grow; click opens detail; Esc / ✕ / backdrop closes
- [ ] Video placeholder shown without `promo.mp4`; plays with it
- [ ] Contact form: empty fields, bad email, success, server-down messages
- [ ] OS "reduce motion" on → no tilt/animations
- [ ] `avatar.glb` missing → page unchanged; present → avatar shows
