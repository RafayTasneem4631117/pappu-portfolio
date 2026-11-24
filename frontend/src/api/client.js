// Small helper for talking to the FastAPI backend.
// VITE_API_URL is empty in development (Vite proxies /api → localhost:8000).
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

async function post(path, body) {
  let res
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('NETWORK')
  }
  let data = null
  try {
    data = await res.json()
  } catch {
    /* response had no JSON body */
  }
  if (!res.ok) {
    const detail = data?.detail
    const message =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail.map((d) => d.msg).join(' ')
          : 'Something went wrong.'
    const err = new Error(message)
    err.status = res.status
    throw err
  }
  return data
}

/** Ask Pappu a question. `history` = previous [{role, content}] messages. */
export const sendChat = (message, history) => post('/chat', { message, history })

/** Send the contact form. */
export const sendContact = (payload) => post('/contact', payload)
