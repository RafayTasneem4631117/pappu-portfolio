import { useCallback, useEffect, useRef } from 'react'

/**
 * useTilt — makes an element lean towards the mouse pointer.
 *
 * Usage:
 *   const tilt = useTilt({ maxTilt: 8 })
 *   <div {...tilt}>…</div>
 *
 * How it works (simple version):
 *  - while the mouse moves over the element we write 4 CSS variables on it:
 *      --rx / --ry  : how much to rotate (degrees)
 *      --mx / --my  : where the pointer is (used for the highlight)
 *  - the CSS in styles/effects.css reads those variables.
 *  - data-hover="true" is set while the pointer is inside (CSS adds scale + glow).
 *  - On touch screens there is no hover, so a tap sets data-active="true"
 *    for a moment (a simple tap highlight).
 *
 * Respects "reduce motion": the tilt is skipped, only the glow remains.
 */
export default function useTilt({ maxTilt = 8, tapMs = 1600 } = {}) {
  const frame = useRef(0)
  const tapTimer = useRef(0)

  useEffect(() => () => {
    cancelAnimationFrame(frame.current)
    clearTimeout(tapTimer.current)
  }, [])

  const reduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onPointerEnter = useCallback((e) => {
    if (e.pointerType === 'touch') return
    e.currentTarget.dataset.hover = 'true'
  }, [])

  const onPointerMove = useCallback(
    (e) => {
      if (e.pointerType === 'touch') return
      const el = e.currentTarget
      const { clientX, clientY } = e
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const px = (clientX - r.left) / r.width // 0 … 1
        const py = (clientY - r.top) / r.height
        if (!reduced()) {
          el.style.setProperty('--rx', `${((0.5 - py) * 2 * maxTilt).toFixed(2)}deg`)
          el.style.setProperty('--ry', `${((px - 0.5) * 2 * maxTilt).toFixed(2)}deg`)
        }
        el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
      })
    },
    [maxTilt],
  )

  const onPointerLeave = useCallback((e) => {
    const el = e.currentTarget
    cancelAnimationFrame(frame.current)
    el.dataset.hover = 'false'
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }, [])

  const onPointerDown = useCallback(
    (e) => {
      if (e.pointerType !== 'touch') return
      const el = e.currentTarget
      el.dataset.active = 'true'
      clearTimeout(tapTimer.current)
      tapTimer.current = setTimeout(() => {
        el.dataset.active = 'false'
      }, tapMs)
    },
    [tapMs],
  )

  return { onPointerEnter, onPointerMove, onPointerLeave, onPointerDown }
}
