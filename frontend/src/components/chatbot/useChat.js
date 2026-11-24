import { useCallback, useRef, useState } from 'react'
import { sendChat } from '../../api/client.js'

const GREETING = {
  id: 'greeting',
  role: 'assistant',
  content:
    'Hi! I’m Pappu, Rafay’s portfolio buddy. Ask me about his projects, tools, education or experience!',
}

/**
 * useChat — all chatbot logic (state + calling the backend) in one place,
 * kept separate from the UI so the website components stay simple.
 */
export default function useChat() {
  const [messages, setMessages] = useState([GREETING])
  const [loading, setLoading] = useState(false)
  const counter = useRef(0)

  const send = useCallback(
    async (text) => {
      const content = text.trim()
      if (!content || loading) return
      const userMsg = { id: `u${++counter.current}`, role: 'user', content }
      // Send only the last 8 real messages as context (skip the greeting)
      const history = messages.filter((m) => m.id !== 'greeting').slice(-8).map(({ role, content }) => ({ role, content }))
      setMessages((m) => [...m, userMsg])
      setLoading(true)
      try {
        const data = await sendChat(content, history)
        setMessages((m) => [...m, { id: `a${++counter.current}`, role: 'assistant', content: data.answer }])
      } catch (err) {
        const text =
          err.message === 'NETWORK'
            ? 'Oops, I can’t reach my brain (the backend server) right now. Is it running?'
            : err.status === 429
              ? 'Whoa, slow down a little! Try again in a minute.'
              : `Hmm, something went wrong: ${err.message}`
        setMessages((m) => [...m, { id: `e${++counter.current}`, role: 'assistant', content: text, isError: true }])
      } finally {
        setLoading(false)
      }
    },
    [messages, loading],
  )

  return { messages, loading, send }
}
