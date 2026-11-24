import { useEffect, useRef, useState } from 'react'
import useChat from './useChat.js'

/**
 * ChatWidget — Pappu's chat window.
 * Opened by clicking the first Pappu in the About section (see App.jsx).
 * Bottom-right panel on desktop, nearly full-screen sheet on mobile.
 */
export default function ChatWidget({ open, onClose }) {
  const { messages, loading, send } = useChat()
  const [draft, setDraft] = useState('')
  const listRef = useRef(null)
  const inputRef = useRef(null)

  // keep the newest message in view
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading, open])

  // focus the input on open, close on Escape
  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const submit = (e) => {
    e.preventDefault()
    if (!draft.trim()) return
    send(draft)
    setDraft('')
  }

  return (
    <aside className="chat" role="dialog" aria-label="Chat with Pappu">
      <header className="chat__header">
        <img className="chat__avatar" src="/pappu/pappu-hi.png" alt="" />
        <div>
          <strong className="chat__name">Pappu</strong>
          <span className="chat__sub">Ask me about Rafay!</span>
        </div>
        <button type="button" className="chat__close" onClick={onClose} aria-label="Close chat">✕</button>
      </header>

      <div className="chat__list" ref={listRef} aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={`bubble bubble--${m.role}${m.isError ? ' bubble--error' : ''}`}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="bubble bubble--assistant bubble--typing" aria-label="Pappu is typing">
            <span /><span /><span />
          </div>
        )}
      </div>

      <form className="chat__form" onSubmit={submit}>
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          maxLength={500}
          aria-label="Your message"
        />
        <button type="submit" disabled={loading || !draft.trim()}>Send</button>
      </form>
    </aside>
  )
}
