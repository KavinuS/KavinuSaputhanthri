'use client'

import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'
import { useCallback, useRef, useState, type KeyboardEvent, type UIEvent } from 'react'
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
}: {
  images: ProjectImage[]
  title: string
  variant?: 'page' | 'card'
}) {
  const reduceMotion = useReducedMotion()
  const trackRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)

  const isCard = variant === 'card'

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current
      if (!track) return

      const clamped = Math.max(0, Math.min(index, images.length - 1))
      track.scrollTo({
        left: clamped * track.clientWidth,
        behavior: reduceMotion ? 'auto' : 'smooth',
      })
    },
    [images.length, reduceMotion],
  )

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
    <figure className="m-0">
      <div className="relative overflow-hidden rounded-lg border border-line bg-paper-raised">
        <ul
          ref={trackRef}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
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
