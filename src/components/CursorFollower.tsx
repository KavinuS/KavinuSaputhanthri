'use client'

import { useEffect, useRef } from 'react'

/** How much of the remaining distance each element closes per frame. */
const DOT_EASE = 0.45
const RING_EASE = 0.16

/** Elements the ring reacts to. */
const INTERACTIVE = 'a, button, [role="button"], summary'

/** Below this the values are close enough that the easing can stop chasing. */
const EPSILON = 0.01

/**
 * A smooth cursor follower: a dot pinned to the pointer and a ring that trails
 * behind it, expanding over anything clickable.
 *
 * Position is written straight to the DOM from a requestAnimationFrame loop.
 * Holding the coordinates in React state instead — as the Cursify `useMouse`
 * hook does — would re-render the whole page on every mousemove event.
 *
 * Both layers use `mix-blend-mode: difference`, so the cursor inverts against
 * whatever is underneath: dark on the paper sections, light on the Experience
 * block. No per-section theming needed.
 */
export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Only for real pointing devices, and never when reduced motion is asked
    // for — a trailing cursor is decoration, and the native pointer is the
    // safe default. Touch devices keep their normal behaviour entirely.
    const finePointer = window.matchMedia('(pointer: fine)')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reduceMotion.matches) return

    const root = document.documentElement
    root.classList.add('cursor-active')

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let dotX = targetX
    let dotY = targetY
    let ringX = targetX
    let ringY = targetY

    let ringScale = 1
    let targetRingScale = 1
    let dotScale = 1
    let targetDotScale = 1

    let placed = false
    let frame = 0

    const onMove = (event: MouseEvent) => {
      targetX = event.clientX
      targetY = event.clientY

      // Drop both layers straight onto the pointer the first time rather than
      // letting them fly in from the middle of the screen.
      if (!placed) {
        placed = true
        dotX = ringX = targetX
        dotY = ringY = targetY
        root.classList.add('cursor-visible')
      }

      const target = event.target
      const overInteractive =
        target instanceof Element && target.closest(INTERACTIVE) !== null

      targetRingScale = overInteractive ? 1.7 : 1
      targetDotScale = overInteractive ? 0 : 1
    }

    const onDown = () => {
      targetRingScale *= 0.82
    }
    const onUp = () => {
      targetRingScale /= 0.82
    }

    const onLeave = () => root.classList.remove('cursor-visible')
    const onEnter = () => {
      if (placed) root.classList.add('cursor-visible')
    }

    const render = () => {
      dotX += (targetX - dotX) * DOT_EASE
      dotY += (targetY - dotY) * DOT_EASE
      ringX += (targetX - ringX) * RING_EASE
      ringY += (targetY - ringY) * RING_EASE

      dotScale += (targetDotScale - dotScale) * RING_EASE
      ringScale += (targetRingScale - ringScale) * RING_EASE

      // Snap out the last fraction so the loop settles instead of easing
      // forever towards a value it never quite reaches.
      if (Math.abs(targetDotScale - dotScale) < EPSILON) dotScale = targetDotScale
      if (Math.abs(targetRingScale - ringScale) < EPSILON) ringScale = targetRingScale

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(${dotScale})`
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`

      frame = requestAnimationFrame(render)
    }

    frame = requestAnimationFrame(render)
    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mousedown', onDown, { passive: true })
    document.addEventListener('mouseup', onUp, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      root.classList.remove('cursor-active', 'cursor-visible')
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
