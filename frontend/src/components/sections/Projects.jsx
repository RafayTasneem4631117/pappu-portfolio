import { site } from '../../data/site.js'
import { projects } from '../../data/projects.js'
import SectionTitle from '../common/SectionTitle.jsx'
import ProjectCard from './ProjectCard.jsx'

/** "Stuff I've made" — grid of project cards. Data comes from data/projects.js.
 *  Clicking a card opens its PDF in the on-page viewer (ProjectPDFModal). */
export default function Projects({ onOpenProject }) {
  return (
    <section className="projects section" aria-labelledby="projects-title">
      <SectionTitle id="projects-title" className="center">{site.projectsTitle}</SectionTitle>

      <div className="projects__grid">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={() => onOpenProject(p)} />
        ))}
      </div>

      {/* Decorative doodles, bottom-left (as in the design) */}
      <div className="projects__doodles" aria-hidden="true">
        <img className="projects__pappu" src="/pappu/pappu-easel.png" alt="" draggable="false" />
        <img className="projects__easel" src="/doodles/easel.png" alt="" draggable="false" />
      </div>
    </section>
  )
}
