import { lazy, Suspense } from 'react'
import { site } from '../../data/site.js'
import SafeBoundary from '../common/SafeBoundary.jsx'

// The 3D avatar is loaded only when needed (keeps the first page load light).
const AvatarViewer = lazy(() => import('../avatar/AvatarViewer.jsx'))

/**
 * Hero — the big rounded frame with the greeting.
 * The logo overlaps the top-left corner and "breaks" the frame line,
 * exactly like the design.
 */
export default function Hero() {
  return (
    <header className="hero">
      <div className="hero__frame">
        <h1 className="hero__title">
          <span className="hero__hi">{site.heroGreeting}</span>
          <span className="hero__name">{site.name}</span>
        </h1>

        {/* Renders nothing if assets/avatar/avatar.glb does not exist yet */}
        <SafeBoundary>
          <Suspense fallback={null}>
            <AvatarViewer src={site.avatar.glb} />
          </Suspense>
        </SafeBoundary>
      </div>

      <div className="hero__logo">
        <img src="/doodles/logo.png" alt="Logo" draggable="false" />
      </div>
    </header>
  )
}
