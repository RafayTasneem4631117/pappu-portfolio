/**
 * checkPdf(url) → Promise<boolean>  (true = the file really is a PDF)
 *
 * Why not just try to show it? The Vite dev server (and some web hosts) answer
 * "200 OK" with the website's home page when a file doesn't exist, so an
 * <iframe> would silently show a copy of the portfolio inside the viewer.
 * We read the first bytes and make sure they start with "%PDF".
 */
const results = new Map() // url -> Promise<boolean> (cached for this visit)

async function probe(url) {
  try {
    const res = await fetch(url, { headers: { Range: 'bytes=0-7' }, cache: 'no-store' })
    if (!res.ok) return false
    const reader = res.body.getReader()
    const { value } = await reader.read()
    reader.cancel() // only the first few bytes are needed
    return !!value && new TextDecoder().decode(value.slice(0, 4)) === '%PDF'
  } catch {
    return false
  }
}

export function checkPdf(url) {
  if (!results.has(url)) results.set(url, probe(url))
  return results.get(url)
}

/** Forget cached results (used if you ever want to re-check after adding a file). */
export const clearPdfCache = () => results.clear()
