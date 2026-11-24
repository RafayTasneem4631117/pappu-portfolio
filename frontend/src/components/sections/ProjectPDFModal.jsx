
import { useEffect, useRef, useState } from 'react'
import { checkPdf } from '../../utils/pdfCheck.js'

/**
 * ProjectPDFModal
 *
 * Displays a project PDF or image inside the portfolio website.
 *
 * PDFs:
 * - Display inside an iframe.
 * - Use the browser's built-in PDF viewer.
 *
 * Images:
 * - Display inside the same modal.
 * - Preserve the original aspect ratio.
 * - Never crop or stretch the image.
 *
 * Modal functionality:
 * - Dark background overlay.
 * - Close button.
 * - Close when clicking outside the modal.
 * - Close using the Escape key.
 * - Prevent background scrolling.
 * - Restore focus when the modal closes.
 * - Show a message if a PDF is missing.
 */

export default function ProjectPDFModal({ project, onClose }) {
  const closeRef = useRef(null)

  // Determine whether this project displays an image or PDF.
  const isImage = project.type === 'image'

  // Track the loading status.
  const [state, setState] = useState(
    isImage ? 'ok' : 'checking'
  )

  // --------------------------------------------------
  // 1. CHECK WHETHER THE PDF EXISTS
  // Images do not need a PDF availability check.
  // --------------------------------------------------

  useEffect(() => {
    if (isImage) {
      setState('ok')
      return
    }

    let cancelled = false

    setState('checking')

    checkPdf(project.pdf).then((ok) => {
      if (!cancelled) {
        setState(ok ? 'ok' : 'missing')
      }
    })

    return () => {
      cancelled = true
    }
  }, [project.pdf, isImage])

  // --------------------------------------------------
  // 2. KEYBOARD, FOCUS AND BACKGROUND SCROLL
  // --------------------------------------------------

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const body = document.body

    const previousStyles = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    }

    // Prevent the background page from scrolling.
    // Preserve the page's original horizontal alignment.
    const scrollbarWidth =
      window.innerWidth -
      document.documentElement.clientWidth

    body.style.overflow = 'hidden'

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }

    // Focus the close button when the modal opens.
    closeRef.current?.focus()

    // Handle Escape and keep keyboard focus inside the modal.
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const focusableElements =
          document.querySelectorAll(
            '.pdfm__dialog button, .pdfm__dialog a[href], .pdfm__dialog iframe'
          )

        if (!focusableElements.length) return

        const firstElement = focusableElements[0]
        const lastElement =
          focusableElements[focusableElements.length - 1]

        // Shift + Tab from the first element.
        if (
          e.shiftKey &&
          document.activeElement === firstElement
        ) {
          e.preventDefault()
          lastElement.focus()
        }

        // Tab from the last element.
        else if (
          !e.shiftKey &&
          document.activeElement === lastElement
        ) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Restore everything when the modal closes.
    return () => {
      window.removeEventListener('keydown', handleKeyDown)

      body.style.overflow = previousStyles.overflow
      body.style.paddingRight = previousStyles.paddingRight

      // Return focus without changing the page scroll position.
      previouslyFocused?.focus?.({
        preventScroll: true,
      })
    }
  }, [onClose])

  // --------------------------------------------------
  // 3. PDF VIEWER URL
  // --------------------------------------------------

  const pdfSource = !isImage
    ? `${project.pdf}#view=FitH&navpanes=0`
    : null

  // --------------------------------------------------
  // 4. MODAL CONTENT
  // --------------------------------------------------

  return (
    <div
      className="pdfm"
      onMouseDown={(e) => {
        // Close only when clicking the dark overlay,
        // not when clicking inside the modal.
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="pdfm__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdfm-title"
      >
        {/* Modal header */}
        <header className="pdfm__header">
          <h2
            id="pdfm-title"
            className="pdfm__title"
          >
            {project.title}
          </h2>

          <button
            ref={closeRef}
            type="button"
            className="pdfm__close"
            onClick={onClose}
            aria-label="Close project viewer"
          >
            ✕
          </button>
        </header>

        {/* Modal content */}
        <div className="pdfm__body">

          {/* IMAGE PROJECT: REVISION */}
          {state === 'ok' && isImage && (
            <img
              key={project.image}
              className="pdfm__image"
              src={project.image}
              alt={`${project.title} project`}
            />
          )}

          {/* PDF PROJECTS */}
          {state === 'ok' && !isImage && (
            <iframe
              key={project.pdf}
              className="pdfm__frame"
              src={pdfSource}
              title={`${project.title} PDF`}
            />
          )}

          {/* PDF LOADING MESSAGE */}
          {state === 'checking' && (
            <p
              className="pdfm__msg"
              role="status"
            >
              Loading PDF…
            </p>
          )}

          {/* MISSING PDF MESSAGE */}
          {state === 'missing' && (
            <div
              className="pdfm__msg"
              role="status"
            >
              <strong>
                The {project.title} PDF isn't available yet.
              </strong>

              <span>
                Add the file at{' '}
                <code>assets{project.pdf}</code>
                {' '}and refresh the page.
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
