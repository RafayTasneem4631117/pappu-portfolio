import useTilt from '../../hooks/useTilt.js'

/** A project card: slightly grows, tilts to the pointer and glows on hover. Click opens the project's PDF viewer. */
export default function ProjectCard({ project, onOpen }) {
  const tilt = useTilt({ maxTilt: 6 })
  return (
    <button
      type="button"
      className="card tilt"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`Open the ${project.title} PDF`}
      {...tilt}
    >
      <span className="card__image">
        <img src={project.cover} alt="" loading="lazy" draggable="false" />
      </span>
      <span className="card__title">{project.title}</span>
    </button>
  )
}
