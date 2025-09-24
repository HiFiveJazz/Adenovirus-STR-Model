import { useEffect, useState, useCallback } from 'react'
import './CSS/DRM.css'

export default function DRM({ open = false, onClose = () => {} }) {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)

  // enter/exit with fade
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

  // unmount after fade-out
  const handleBackdropTransitionEnd = (e) => {
    if (!visible && e.target === e.currentTarget) setMounted(false)
  }

  const requestClose = useCallback(() => onClose(), [onClose])

  // lock scroll when mounted
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
      className={`drm-backdrop ${cls}`}
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) requestClose() }}
      onTransitionEnd={handleBackdropTransitionEnd}
    >
      <div
        className={`drm-modal ${cls}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drm-title"
        onTransitionEnd={(e) => e.stopPropagation()}
      >
        <h2 id="drm-title" className="drm-title">DRM Expired</h2>

        <p className="drm-text">
          This calculator’s DRM has expired. Please contact Somatek for an updated calculator.
        </p>

        <p className="drm-contact">
          Visit{' '}
          <a
            href="https://www.somatek.com"
            target="_blank"
            rel="noreferrer"
            className="animated-gradient-text"
          >
            <span className="text-content">somatek.com</span>
            <span className="gradient-overlay"></span>
          </a>{' '}
          or email{' '}
          <a href="mailto:jbhatia@somatek.com" className="animated-gradient-text">
            <span className="text-content">jbhatia@somatek.com</span>
            <span className="gradient-overlay"></span>
          </a>.
        </p>

        <div className="drm-footer">
          <button type="button" className="drm-button" onClick={requestClose} autoFocus>
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

