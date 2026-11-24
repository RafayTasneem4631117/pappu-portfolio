/** A big hand-lettered heading with the thick white underline from the design. */
export default function SectionTitle({ children, as: Tag = 'h2', className = '', id }) {
  return (
    <Tag id={id} className={`section-title ${className}`}>
      <span>{children}</span>
    </Tag>
  )
}
