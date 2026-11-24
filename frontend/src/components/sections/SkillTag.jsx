import useTilt from '../../hooks/useTilt.js'

/** One floating skill label. Tilts towards the pointer, grows and glows on hover. */
export default function SkillTag({ skill }) {
  const tilt = useTilt({ maxTilt: 9 })
  return (
    <li
      className="skill"
      style={{
        '--x': `${skill.x}%`,
        '--y': `${skill.y}%`,
        '--rot': `${skill.rotate}deg`,
      }}
    >
      <span className="skill__label tilt" tabIndex={0} {...tilt}>
        {skill.label}
      </span>
    </li>
  )
}
