// ============================================================
//  PROJECTS — edit this file to add, remove or change projects.
//
//  Clicking a project card opens that project's PDF in a viewer window
//  ON the page (see components/sections/ProjectPDFModal.jsx).
//
//  To ADD a project:
//   1. Make a folder  assets/projects/<your-id>/
//   2. Put cover.jpg (the card image) and project.pdf (your PDF) in it
//   3. Copy one object below and change id, title, cover and pdf
//
//  Paths start with "/" and point inside the assets folder:
//     "/projects/hyperon/project.pdf"  =  assets/projects/hyperon/project.pdf
//
//  If a PDF file is missing, the viewer window shows a helpful message
//  instead of an empty page.
// ============================================================

export const projects = [
  {
    id: 'hyperon',
    title: 'Hyperon Solutions',
    cover: '/projects/hyperon/cover.jpg',
    pdf: '/projects/hyperon/project.pdf',
  },
  {
    id: 'yarnknits',
    title: 'YarnKnits',
    cover: '/projects/yarnknits/cover.jpg',
    pdf: '/projects/yarnknits/project.pdf',
  },
  {
    id: 'courtify',
    title: 'Courtify',
    cover: '/projects/courtify/cover.jpg',
    pdf: '/projects/courtify/project.pdf',
  },
  {
    id: 'hunted-hunter',
    title: 'Hunted/Hunter',
    cover: '/projects/hunted-hunter/cover.jpg',
    pdf: '/projects/hunted-hunter/project.pdf',
  },
  {
  id: 'revision',
  title: 'Revision',
  cover: '/projects/revision/cover.jpg',
  type: 'image',
  image: '/projects/revision/revision.jpg',
  },
]
