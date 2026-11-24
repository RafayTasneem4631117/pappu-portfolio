import { useCallback, useState } from 'react'
import Hero from './components/layout/Hero.jsx'
import Divider from './components/common/Divider.jsx'
import About from './components/sections/About.jsx'
import Skills from './components/sections/Skills.jsx'
import Projects from './components/sections/Projects.jsx'
import VideoSection from './components/sections/VideoSection.jsx'
import Education from './components/sections/Education.jsx'
import Contact from './components/sections/Contact.jsx'
import ChatWidget from './components/chatbot/ChatWidget.jsx'
import ProjectPDFModal from './components/sections/ProjectPDFModal.jsx'

/**
 * App — the whole portfolio is ONE continuous page.
 * Section order follows the Illustrator design:
 *   Hero → About → Things I'm learning → Stuff I've made → In motion → Road so far → Let's talk
 */
export default function App() {
  const [chatOpen, setChatOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(null) // which project's PDF is open (null = none)

  const closeChat = useCallback(() => setChatOpen(false), [])
  const closePdf = useCallback(() => setActiveProject(null), [])

  return (
    <div className="page">
      {/* .content is the width-scaling wrapper; the chat window and PDF viewer live
          OUTSIDE it because they are position:fixed overlays. */}
      <main className="content">
      <Hero />
      <About onOpenChat={() => setChatOpen(true)} />
      <Divider />
      <Skills />
      <Divider />
      <Projects onOpenProject={setActiveProject} />
      <Divider />
      <VideoSection />
      <Divider />
      <Education />
      <Divider />
      <Contact />
      </main>

      {activeProject && <ProjectPDFModal project={activeProject} onClose={closePdf} />}
      <ChatWidget open={chatOpen} onClose={closeChat} />
    </div>
  )
}
