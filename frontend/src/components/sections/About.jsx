import { site } from '../../data/site.js'
import SectionTitle from '../common/SectionTitle.jsx'

/**
 * About — "A little about me".
 * The first Pappu (next to "Hi!") is a BUTTON that opens the chatbot.
 */
export default function About({ onOpenChat }) {
  return (
    <section className="about section" aria-labelledby="about-title">
      <div className="about__head">
        <SectionTitle id="about-title">{site.about.title}</SectionTitle>

        <div className="about__pappu">
          <button
            type="button"
            className="pappu-button"
            onClick={onOpenChat}
            aria-label="Chat with Pappu"
            title="Click Pappu to chat!"
          >
            <img src="/pappu/pappu-hi.png" alt="Pappu, my mascot" draggable="false" />
          </button>
          <span className="about__hi" aria-hidden="true">{site.about.handwrittenHi}</span>
        </div>
      </div>
      <p className="about__text">{site.about.text}</p>
    </section>
  )
}
