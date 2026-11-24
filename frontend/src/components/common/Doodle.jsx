/**
 * Doodle — a decorative hand-drawn image (books, easel, popcorn…).
 * alt="" + aria-hidden because they are purely decorative.
 */
export default function Doodle({ src, className = '', style }) {
  return (
    <img
      className={`doodle ${className}`}
      src={src}
      alt=""
      aria-hidden="true"
      draggable="false"
      style={style}
    />
  )
}
