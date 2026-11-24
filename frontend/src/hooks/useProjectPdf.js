import { useCallback, useEffect, useState } from 'react'
import { projects } from '../data/projects.js'

/**
 * useProjectPdf — decides what happens when a project card is clicked.
 *
 * The card is a normal link (<a href="…pdf" target="_blank">), so the browser
 * opens the PDF in a new tab with its built-in PDF viewer.
 * This hook only steps in to STOP the click when the PDF file is missing, and
 * shows a helpful message instead.
 *
 * Why we must check the file contents: the dev server (and some hosts) answer
 * "200 OK" with the website's home page for files that don't exist, so we read
 * the first bytes and make sure they start with "%PDF".
 */

const status = new Map() // url -> true (real PDF) | false (missing)
const pending = new Map() // url -> Promise<boolean>

async function probe(url) {
  try {
    const res = await fetch(url, { headers: { Range: 'bytes=0-7' }, cache: 'no-store' })
    if (!res.ok) return false
    const reader = res.body.getReader()
    const { value } = await reader.read()
    reader.cancel() // we only need the first few bytes
    return !!value && new TextDecoder().decode(value.slice(0, 4)) === '%PDF'
  } catch {
    return false
  }
}

function checkPdf(url) {
  if (!pending.has(url)) {
    pending.set(url, probe(url).then((ok) => { status.set(url, ok); return ok }))
  }
  return pending.get(url)
}

export default function useProjectPdf() {
  const [notice, setNotice] = useState(null) // { id, title, pdf } | null

  // Check all PDFs once when the page loads, so a click can be answered instantly.
  useEffect(() => { projects.forEach((p) => checkPdf(p.pdf)) }, [])

  const dismiss = useCallback(() => setNotice(null), [])

  const handleClick = useCallback((event, project) => {
    const known = status.get(project.pdf)
    if (known === true) { setNotice(null); return } // let the link open the PDF normally

    event.preventDefault() // never open a broken / empty page
    if (known === false) {
      setNotice(project)
      return
    }
    // Check still running (clicked within a split second of page load): wait for it.
    checkPdf(project.pdf).then((ok) => {
      if (ok) window.open(project.pdf, '_blank', 'noopener,noreferrer')
      else setNotice(project)
    })
  }, [])

  return { notice, dismiss, handleClick }
}
