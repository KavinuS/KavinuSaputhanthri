'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  /** Seconds to wait before the animation starts. */
  delay?: number
  /** Distance in pixels the element travels upward into place. */
  distance?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'span'
}

/**
 * Fades content upward as it enters the viewport, once.
 *
 * The server renders children fully visible on purpose. Hiding them up front
 * would mean a bundle that is slow, blocked or disabled leaves the page looking
 * empty, since only JavaScript could ever fade them back in.
 *
 * Instead the hidden state is opted into on the client, and only for elements
 * still below the fold when the component mounts — those are off-screen, so
 * hiding them is invisible to the reader. Anything already on screen simply
 * stays as it is.
 */
export function Reveal({ children, delay = 0, distance = 24, className, as = 'div' }: RevealProps) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Only animate what the reader has not seen yet.
    const { top } = element.getBoundingClientRect()
    if (top > window.innerHeight * 0.9) setAnimate(true)
  }, [])

  const Tag = as

  if (reduceMotion || !animate) {
    return (
      <Tag ref={ref as never} className={className}>
        {children}
      </Tag>
    )
  }

  const MotionTag = motion[as]

  return (
    <MotionTag
      ref={ref as never}
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
