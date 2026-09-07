'use client'

import { useEffect } from 'react'
import { site } from '@/data/site'

/** Kept up at least this long so a fast load does not flash the curtain. */
const MIN_VISIBLE_MS = 700

/** Length of the lift-away animation in globals.css. */
const LIFT_MS = 900

/**
 * The loading curtain.
 *
 * The overlay itself is inert CSS — hidden unless the inline script in the
 * document has marked the page as loading. This component's only job is to take
 * it down once the browser reports every resource in, which is also why the
 * inline script keeps its own timeout: if this bundle never arrives, the
 * curtain still lifts.
 */
export function Loader() {
  useEffect(() => {
    const root = document.documentElement

    // Nothing to dismiss: reduced motion, a repeat client-side render, or the
    // inline script's failsafe already fired.
    if (!root.classList.contains('is-loading')) return

    const mountedAt = performance.now()
    let dismissTimer: ReturnType<typeof setTimeout>
    let cleanupTimer: ReturnType<typeof setTimeout>

    const dismiss = () => {
      const remaining = Math.max(0, MIN_VISIBLE_MS - (performance.now() - mountedAt))

      dismissTimer = setTimeout(() => {
        root.classList.remove('is-loading')
        root.classList.add('is-leaving')
        // Drop the leaving class once the lift has played, so the overlay goes
        // back to display:none instead of sitting off-screen forever.
        cleanupTimer = setTimeout(() => root.classList.remove('is-leaving'), LIFT_MS)
      }, remaining)
    }

    // `load` fires after images, fonts and stylesheets — not just the HTML.
    if (document.readyState === 'complete') {
      dismiss()
    } else {
      window.addEventListener('load', dismiss, { once: true })
    }

    return () => {
      clearTimeout(dismissTimer)
      clearTimeout(cleanupTimer)
      window.removeEventListener('load', dismiss)
    }
  }, [])

  return (
    <div className="loader" aria-hidden="true">
      <div className="loader-inner">
        <span className="loader-name">{site.name}</span>
        <span className="loader-track">
          <span className="loader-bar" />
        </span>
      </div>
    </div>
  )
}
