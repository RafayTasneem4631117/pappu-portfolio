import { useRef, useState } from 'react'
import { site } from '../../data/site.js'
import SectionTitle from '../common/SectionTitle.jsx'

/**
 * "In motion" — responsive MP4 player inside the rounded white frame.
 * Replace assets/video/promo.mp4 with your own file (no code change needed).
 * If the file is missing, a labelled placeholder is shown (no fake video).
 */
export default function VideoSection() {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [missing, setMissing] = useState(false)

  const start = () => {
    const v = videoRef.current
    if (!v || missing) return
    v.play().catch(() => setMissing(true))
  }

  return (
    <section className="motion section" aria-labelledby="motion-title">
      <SectionTitle id="motion-title">{site.video.title}</SectionTitle>

      <div className="video-frame">
        <video
          ref={videoRef}
          className="video-frame__video"
          src={site.video.src}
          poster={site.video.poster || undefined}
          preload="metadata"
          playsInline
          controls={playing}
          onPlay={() => setPlaying(true)}
          onEnded={() => setPlaying(false)}
          onError={() => setMissing(true)}
        />

        {!playing && (
          <button type="button" className="video-frame__play" onClick={start} aria-label="Play video">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <path d="M30 14 L82 46 Q88 50 82 54 L30 86 Q22 90 22 80 L22 20 Q22 10 30 14 Z" fill="currentColor" />
            </svg>
          </button>
        )}

        {missing && (
          <p className="video-frame__note" role="status">
            PLACEHOLDER — add your video at <code>assets/video/promo.mp4</code>
          </p>
        )}
      </div>

      <div className="motion__doodles" aria-hidden="true">
        <img className="motion__popcorn" src="/doodles/popcorn.png" alt="" draggable="false" />
        <img className="motion__pappu" src="/pappu/pappu-popcorn.png" alt="" draggable="false" />
      </div>
    </section>
  )
}
