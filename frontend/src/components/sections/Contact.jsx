import { useRef, useState } from 'react'
import { site } from '../../data/site.js'
import { sendContact } from '../../api/client.js'
import SectionTitle from '../common/SectionTitle.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const empty = { name: '', email: '', subject: '', message: '', website: '' } // "website" = hidden spam trap

/** Check the fields in the browser first (the backend validates again). */
function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Please enter your name.'
  if (!v.email.trim()) e.email = 'Please enter your email.'
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'That email doesn’t look right.'
  if (!v.subject.trim()) e.subject = 'Please add a subject.'
  if (!v.message.trim()) e.message = 'Please write a message.'
  else if (v.message.trim().length < 10) e.message = 'Message is a bit short (min 10 characters).'
  return e
}

export default function Contact() {
  const [values, setValues] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: 'idle', text: '' })
  const openedAt = useRef(Date.now()) // lets the backend spot bots that submit instantly

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }))

  async function onSubmit(ev) {
    ev.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setStatus({ type: 'error', text: 'Please fix the highlighted fields.' })
      return
    }
    setStatus({ type: 'sending', text: 'Sending…' })
    try {
      await sendContact({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        website: values.website,
        elapsed_ms: Date.now() - openedAt.current,
      })
      setValues(empty)
      setStatus({ type: 'success', text: 'Message sent! Thank you — I’ll get back to you soon.' })
    } catch (err) {
      setStatus({
        type: 'error',
        text:
          err.message === 'NETWORK'
            ? `Couldn’t reach the server. You can email me directly at ${site.email}.`
            : err.message,
      })
    }
  }

  const field = (key, label, props = {}) => (
    <div className="field">
      <label htmlFor={`c-${key}`}>{label}</label>
      {props.as === 'textarea' ? (
        <textarea id={`c-${key}`} rows="4" value={values[key]} onChange={set(key)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `e-${key}` : undefined} maxLength={5000} />
      ) : (
        <input id={`c-${key}`} type={props.type || 'text'} value={values[key]} onChange={set(key)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `e-${key}` : undefined} maxLength={200} autoComplete={props.autoComplete} />
      )}
      {errors[key] && <p className="field__error" id={`e-${key}`}>{errors[key]}</p>}
    </div>
  )

  return (
    <section className="contact section" aria-labelledby="contact-title">
      <SectionTitle id="contact-title">{site.contact.title}</SectionTitle>

      <div className="contact__grid">
        <div className="contact__side">
          <img className="contact__pappu" src="/doodles/idea-pappu.png" alt="" aria-hidden="true" draggable="false" />
          <p className="contact__text">{site.contact.text}</p>
          <a className="contact__email" href={`mailto:${site.email}`}>{site.email}</a>
        </div>

        <form className="form" onSubmit={onSubmit} noValidate>
          {field('name', 'Your name', { autoComplete: 'name' })}
          {field('email', 'Your email', { type: 'email', autoComplete: 'email' })}
          {field('subject', 'Subject')}
          {field('message', 'Message', { as: 'textarea' })}

          {/* Honeypot: invisible to people, bots fill it in → backend rejects */}
          <div className="form__trap" aria-hidden="true">
            <label htmlFor="c-website">Leave this empty</label>
            <input id="c-website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
          </div>

          <button type="submit" className="form__submit" disabled={status.type === 'sending'}>
            {status.type === 'sending' ? 'Sending…' : 'Send message'}
          </button>

          <p className={`form__status form__status--${status.type}`} role="status" aria-live="polite">
            {status.type !== 'idle' && status.type !== 'sending' ? status.text : ''}
          </p>
        </form>
      </div>
    </section>
  )
}
