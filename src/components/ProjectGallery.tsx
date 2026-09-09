'use client'

import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type UIEvent } from 'react'
import type { ProjectImage } from '@/data/projects'
import { asset } from '@/lib/base-path'

/**
 * A horizontally scrollable set of project screenshots.
 *
 * The track is a real scroll container rather than a transform-driven carousel,
 * so a trackpad swipe, a touch drag, a shift-wheel and the scrollbar all work
 * with no JavaScript involved. Scroll snapping is what makes it land on whole
 * slides; the buttons below only nudge that same scroll position, so there is
 * never a second source of truth about which slide is showing.
 *
 * Every slide is exactly one container wide, which is what lets the active
 * index be read straight back off `scrollLeft` while the reader drags.
 */
export function ProjectGallery({
  images,
  title,
  /**
   * `page` is the detail-page lead visual: captioned, with a thumbnail strip.
   * `card` is the compact form used in the Selected Work list, where six of
   * these sit on one page and a thumbnail strip under each would be noise.
   */
  variant = 'page',
  /**
   * Advance on a timer. On by default for cards, where the gallery has to show
   * that it is a gallery without being touched; off for the detail page, where
   * moving the image out from under someone reading its caption is hostile.
   */
  autoPlay = variant === 'card',
  /** Seconds each slide is held before the next one comes in. */
  interval = 4.5,
}: {
  images: ProjectImage[]
  title: string
  variant?: 'page' | 'card'
  autoPlay?: boolean
  interval?: number
}) {
  const reduceMotion = useReducedMotion()
  const trackRef = useRef<HTMLUListElement>(null)
  const frameRef = useRef<number | null>(null)
  const figureRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  /** Set by the reader, via the pause control. Survives hover and scrolling. */
  const [playing, setPlaying] = useState(true)
  /** Momentary: pointer over the gallery, or focus somewhere inside it. */
  const [held, setHeld] = useState(false)
  /** Nothing should be moving in a gallery that is not on screen. */
  const [onScreen, setOnScreen] = useState(false)

  const isCard = variant === 'card'

  const stopAnimation = useCallback(() => {
    if (frameRef.current === null) return
    cancelAnimationFrame(frameRef.current)
    frameRef.current = null

    // Snapping is switched off for the duration of a scripted slide (see
    // below), so it has to come back the moment that slide ends or is cut off.
    const track = trackRef.current
    if (track) track.style.scrollSnapType = ''
  }, [])

  useEffect(() => stopAnimation, [stopAnimation])

  /**
   * Slides the track to a given image.
   *
   * This drives `scrollLeft` frame by frame rather than calling `scrollTo` with
   * `behavior: 'smooth'`. Two things kept the native version from ever being
   * seen: `scroll-snap-type: mandatory` cuts a scripted smooth scroll short in
   * several browsers, landing on the snap point immediately, and the whole
   * animation collapsed to a jump for anyone whose system asks for reduced
   * motion. Snapping is therefore suspended while the slide runs — it is only
   * needed to settle a *manual* drag — and the easing is applied here, where
   * the duration is known and the result is the same in every browser.
   */
  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current
      if (!track) return

      stopAnimation()

      const clamped = Math.max(0, Math.min(index, images.length - 1))
      const from = track.scrollLeft
      const to = clamped * track.clientWidth
      const distance = to - from
      if (Math.abs(distance) < 1) return

      if (reduceMotion) {
        track.scrollLeft = to
        return
      }

      // Long jumps from a dot press earn a little more time than a step of one.
      const slides = Math.abs(distance) / Math.max(track.clientWidth, 1)
      const duration = Math.min(900, 420 + slides * 120)
      const start = performance.now()

      track.style.scrollSnapType = 'none'

      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / duration)
        // easeInOutCubic — settles rather than stopping dead on arrival.
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2

        track.scrollLeft = from + distance * eased

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(step)
        } else {
          frameRef.current = null
          track.style.scrollSnapType = ''
        }
      }

      frameRef.current = requestAnimationFrame(step)
    },
    [images.length, reduceMotion, stopAnimation],
  )

  // Autoplay in a gallery scrolled past is wasted work and wasted battery, so
  // the timer below only runs while the gallery is actually on screen.
  useEffect(() => {
    const figure = figureRef.current
    if (!figure || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.35 },
    )
    observer.observe(figure)
    return () => observer.disconnect()
  }, [])

  const autoPlaying =
    autoPlay && playing && !held && onScreen && !reduceMotion && images.length > 1

  /**
   * Advances the gallery on a timer.
   *
   * Keyed on `active`, so the clock restarts from zero every time the slide
   * changes — including when the reader scrolls or presses an arrow. That is
   * what stops the timer from firing a moment after someone has just chosen a
   * slide for themselves, which is the thing that makes an auto-carousel feel
   * like it is fighting you.
   */
  useEffect(() => {
    if (!autoPlaying) return

    const timer = setTimeout(
      () => scrollToIndex(active === images.length - 1 ? 0 : active + 1),
      interval * 1000,
    )
    return () => clearTimeout(timer)
  }, [active, autoPlaying, images.length, interval, scrollToIndex])

  // The scroll position is the state; this only mirrors it for the controls.
  const handleScroll = (event: UIEvent<HTMLUListElement>) => {
    const track = event.currentTarget
    if (track.clientWidth === 0) return

    const index = Math.round(track.scrollLeft / track.clientWidth)
    setActive(Math.max(0, Math.min(index, images.length - 1)))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollToIndex(active + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollToIndex(active - 1)
    }
  }

  const atStart = active === 0
  const atEnd = active === images.length - 1

  return (
    <figure
      ref={figureRef}
      className="m-0"
      // Hovering or tabbing into the gallery is a signal that the reader is
      // looking at this slide; hold it until they leave.
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div className="relative overflow-hidden rounded-lg border border-line bg-paper-raised">
        <ul
          ref={trackRef}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          // A reader who grabs the track mid-slide outranks the animation.
          onPointerDown={stopAnimation}
          onWheel={stopAnimation}
          onTouchStart={stopAnimation}
          tabIndex={0}
          aria-label={`${title} screenshots`}
          className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => (
            <li
              key={image.src}
              aria-label={`${index + 1} of ${images.length}`}
              className="w-full shrink-0 snap-start"
            >
              <Image
                src={asset(image.src)}
                alt={image.caption ? `${title} — ${image.caption}` : ''}
                width={image.width}
                height={image.height}
                // On the detail page the first slide is the lead visual, so it
                // must not wait for the lazy-loading observer. In the card list
                // every gallery is below the fold, so all of it can wait.
                loading={!isCard && index === 0 ? 'eager' : 'lazy'}
                fetchPriority={!isCard && index === 0 ? 'high' : 'auto'}
                sizes={isCard ? '(max-width: 1024px) 100vw, 58vw' : '100vw'}
                // A fixed frame keeps the gallery from resizing under the reader
                // when a slide has a slightly different capture ratio, and
                // `contain` means no part of a screenshot is ever cropped away.
                className="aspect-[16/9] w-full bg-paper-raised object-contain"
              />
            </li>
          ))}
        </ul>

        {/* Arrows sit over the frame on pointer devices; touch users just swipe. */}
        <GalleryArrow
          direction="previous"
          disabled={atStart}
          onClick={() => scrollToIndex(active - 1)}
        />
        <GalleryArrow direction="next" disabled={atEnd} onClick={() => scrollToIndex(active + 1)} />

        <p className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-line-strong bg-paper/85 px-3 py-1 font-display text-xs tabular-nums text-ink-muted backdrop-blur-sm">
          {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </p>

        {/*
          Anything that moves on its own needs a way to stop it — this is the
          one control that is not just a shortcut for scrolling the track.
        */}
        {autoPlay && !reduceMotion && images.length > 1 ? (
          <button
            type="button"
            onClick={() => setPlaying((current) => !current)}
            aria-pressed={!playing}
            aria-label={playing ? 'Pause the gallery' : 'Play the gallery'}
            className="absolute bottom-3 left-3 flex h-8 items-center gap-1.5 rounded-full border border-line-strong bg-paper/85 px-3 font-display text-xs text-ink-muted backdrop-blur-sm transition-colors duration-300 hover:text-ink motion-reduce:transition-none"
          >
            <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span>
            {playing ? 'Pause' : 'Play'}
          </button>
        ) : null}
      </div>

      {isCard ? (
        <GalleryDots count={images.length} active={active} onSelect={scrollToIndex} title={title} />
      ) : (
        /* Thumbnails double as the position indicator, so there are no dots. */
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((image, index) => (
            <li key={image.src} className="shrink-0">
              <button
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-current={index === active}
                aria-label={`Show screenshot ${index + 1}${image.caption ? `: ${image.caption}` : ''}`}
                className={`block overflow-hidden rounded border transition-opacity duration-300 motion-reduce:transition-none ${
                  index === active
                    ? 'border-ink opacity-100'
                    : 'border-line opacity-55 hover:opacity-100'
                }`}
              >
                <Image
                  src={asset(image.src)}
                  alt=""
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  sizes="120px"
                  className="h-12 w-20 bg-paper-raised object-cover object-top sm:h-14 sm:w-24"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {!isCard && images[active]?.caption ? (
        <figcaption className="mt-3 text-sm text-ink-muted">{images[active].caption}</figcaption>
      ) : null}
    </figure>
  )
}

function GalleryDots({
  count,
  active,
  onSelect,
  title,
}: {
  count: number
  active: number
  onSelect: (index: number) => void
  title: string
}) {
  return (
    <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label={`${title} gallery position`}>
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <button
            type="button"
            onClick={() => onSelect(index)}
            aria-current={index === active}
            aria-label={`Show screenshot ${index + 1} of ${count}`}
            // A wider bar for the active slide rather than a filled dot: it
            // reads as position on a strip, and survives being monochrome.
            className={`block h-1 rounded-full transition-all duration-300 motion-reduce:transition-none ${
              index === active ? 'w-7 bg-ink' : 'w-3 bg-line-strong hover:bg-ink-muted'
            }`}
          />
        </li>
      ))}
    </ul>
  )
}

function GalleryArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 'previous' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  const isNext = direction === 'next'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${isNext ? 'Next' : 'Previous'} screenshot`}
      className={`absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-paper/85 text-ink backdrop-blur-sm transition-opacity duration-300 hover:bg-paper disabled:pointer-events-none disabled:opacity-0 motion-reduce:transition-none sm:flex ${
        isNext ? 'right-3' : 'left-3'
      }`}
    >
      <span aria-hidden="true">{isNext ? '→' : '←'}</span>
    </button>
  )
}
