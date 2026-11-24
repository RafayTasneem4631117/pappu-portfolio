import { useEffect } from 'react'

/**
 * PdfNotice — small message shown when a project's PDF file is missing.
 * Disappears by itself after 9 seconds, or with the ✕ button / Esc key.
 */
export default function PdfNotice({ project, onClose }) {
  useEffect(() => {
    if (!project) return
    const timer = setTimeout(onClose, 9000)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => { clearTimeout(timer); window.removeEventListener('keydown', onKey) }
  }, [project, onClose])

  if (!project) return null
  const file = `assets${project.pdf}` // "/projects/x/project.pdf" -> "assets/projects/x/project.pdf"

  return (
    <div className="pdf-notice" role="status" aria-live="polite">
      <p className="pdf-notice__text">
        <strong>The {project.title} PDF isn’t available yet.</strong>
        <span>Add the file at <code>{file}</code> and try again.</span>
      </p>
      <button type="button" className="pdf-notice__close" onClick={onClose} aria-label="Dismiss message">✕</button>
    </div>
  )
}
