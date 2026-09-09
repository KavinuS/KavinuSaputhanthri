'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { AvailabilityPill } from './ui/AvailabilityPill'
import { navLinks, site } from '@/data/site'
import { asset } from '@/lib/base-path'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock the page behind the mobile menu, and let Escape close it.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 motion-reduce:transition-none ${
        scrolled || open
          ? 'border-b border-line bg-paper/60 backdrop-blur-sm'
          : 'border-b border-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6 px-6 py-4 sm:px-8 lg:px-12"
      >
        <a
          href={asset('/#top')}
          className="animate-nav-in shrink-0"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="hidden lg:inline-block">
            <AvailabilityPill />
          </span>
          <span className="font-display text-sm font-medium tracking-tight lg:hidden">
            {site.firstName}
            <span className="text-ink-muted"> S.</span>
          </span>
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link, index) => (
            <li
              key={link.href}
              className="animate-nav-in"
              style={{ animationDelay: `${0.18 + index * 0.06}s` }}
            >
              <a
                href={asset(link.href)}
                className="group relative inline-block py-1 text-sm text-ink transition-colors duration-300 hover:text-ink-muted motion-reduce:transition-none"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-ink transition-[width] duration-400 ease-out group-hover:w-full motion-reduce:transition-none" />
              </a>
            </li>
          ))}
        </ul>

        <div className="animate-nav-in flex items-center gap-3" style={{ animationDelay: '0.5s' }}>
          <a
            href={asset('/#contact')}
            className="hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ink-soft motion-reduce:transition-none sm:inline-flex"
          >
            Let&apos;s Talk
            <span aria-hidden="true">↗</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line-strong lg:hidden"
          >
            <span className="relative block h-3 w-4" aria-hidden="true">
              <span
                className={`absolute left-0 block h-px w-4 bg-ink transition-transform duration-300 motion-reduce:transition-none ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-4 bg-ink transition-transform duration-300 motion-reduce:transition-none ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-line bg-paper lg:hidden"
          >
            <ul className="flex flex-col px-6 py-2 sm:px-8">
              {navLinks.map((link) => (
                <li key={link.href} className="border-b border-line last:border-b-0">
                  <a
                    href={asset(link.href)}
                    onClick={() => setOpen(false)}
                    className="block py-4 font-display text-2xl tracking-tight"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-6 pb-6 pt-4 text-sm text-ink-muted sm:px-8">
              <a href={site.github} target="_blank" rel="noopener noreferrer">
                GitHub ↗
              </a>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
              <a href={asset(site.resume)} download>
                Resume ↗
              </a>
            </div>

            <div className="px-6 pb-6 sm:px-8">
              <AvailabilityPill />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
