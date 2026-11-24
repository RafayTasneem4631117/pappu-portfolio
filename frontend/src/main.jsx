import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/bangers'
import '@fontsource/comic-neue/400.css'
import '@fontsource/comic-neue/700.css'
import './styles/global.css'
import './styles/sections.css'
import './styles/effects.css'
import './styles/chatbot.css'
import './styles/project-pdf-modal.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
