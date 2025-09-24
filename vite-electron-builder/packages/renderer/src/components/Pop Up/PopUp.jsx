import { useEffect, useState, useCallback } from 'react'
import './CSS/PopUp.css'

export default function PopUp({ open = false, onClose = () => {} }) {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      setVisible(false)
      const id = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(id)
    } else if (mounted) {
      setVisible(false)
    }
  }, [open, mounted])

  const handleBackdropTransitionEnd = (e) => {
    if (!visible && e.target === e.currentTarget) {
      setMounted(false)
    }
  }

  const requestClose = useCallback(() => onClose(), [onClose])

  useEffect(() => {
    if (!mounted) return
    const onKey = (e) => e.key === 'Escape' && requestClose()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [mounted, requestClose])

  if (!mounted) return null

  const cls = visible ? 'is-visible' : ''

  return (
    <div
      className={`popup-backdrop ${cls}`}
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) requestClose() }}
      onTransitionEnd={handleBackdropTransitionEnd}
    >
      <div
        className={`popup-modal ${cls}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        onTransitionEnd={(e) => e.stopPropagation()}
      >
        <h2 id="popup-title" className="popup-title">Assumptions</h2>

        <ul className="popup-list">
          <li>The infection probability follows a classic Poisson distribution.</li>
          <li>There are no secondary infectious events.</li>
          <li>There is a 7% daily attrition rate of infected cells.</li>
        </ul>

        <div className="popup-footer">
          <div className="popup-contact">
            Visit{" "}
            <a
              href="https://www.somatek.com"
              target="_blank"
              rel="noreferrer"
              className="animated-gradient-text"
            >
              somatek.com
            </a>{" "}
            for contact info
            <br />
            or email{" "}
            <a href="mailto:jbhatia@somatek.com" className="animated-gradient-text">
              jbhatia@somatek.com
            </a>{" "}
            to request an updated calculator.
          </div>
          <button type="button" className="popup-button" onClick={requestClose} autoFocus>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

