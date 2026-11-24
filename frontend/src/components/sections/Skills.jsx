import { site } from '../../data/site.js'
import { skills } from '../../data/skills.js'
import SectionTitle from '../common/SectionTitle.jsx'
import Doodle from '../common/Doodle.jsx'
import SkillTag from './SkillTag.jsx'

/** "Things I'm learning" — floating skill labels with a 3D hover effect. */
export default function Skills() {
  return (
    <section className="learning section" aria-labelledby="learning-title">
      <div className="learning__head">
        <div className="learning__doodles" aria-hidden="true">
          <Doodle src="/doodles/books.png" className="learning__books" />
          <img className="learning__pappu" src="/pappu/pappu-glasses.png" alt="" draggable="false" />
        </div>
        <div className="learning__titles">
          <SectionTitle id="learning-title">{site.learning.title}</SectionTitle>
          <p className="learning__sub">{site.learning.subtitle}</p>
        </div>
      </div>

      <ul className="skills" aria-label="Tools I am learning">
        {skills.map((s) => (
          <SkillTag key={s.id} skill={s} />
        ))}
      </ul>
    </section>
  )
}
