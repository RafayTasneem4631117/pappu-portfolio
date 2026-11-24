import { roadLabel, roadEntries } from '../../data/education.js'
import SectionTitle from '../common/SectionTitle.jsx'

/** "The road so far" — education / experience list from data/education.js */
export default function Education() {
  return (
    <section className="road section" aria-labelledby="road-title">
      <img className="road__car" src="/doodles/car-pappu.png" alt="" aria-hidden="true" draggable="false" />
      <SectionTitle id="road-title">The road so far</SectionTitle>
      <p className="road__label"><span>{roadLabel}</span></p>
      <ul className="road__list">
        {roadEntries.map((e) => (
          <li key={e.id}>
            <p className="road__title">{e.title}</p>
            <p className="road__years">{e.years}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
