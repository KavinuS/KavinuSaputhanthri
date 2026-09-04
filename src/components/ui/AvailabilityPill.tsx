import { site } from '@/data/site'

/**
 * The only place colour appears in the design system.
 * The pulse is decorative and disappears under prefers-reduced-motion.
 */
export function AvailabilityPill({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-medium tracking-tight ${
        dark ? 'border-night-line text-white' : 'border-line-strong bg-paper-raised text-ink'
      }`}
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
      </span>
      {site.availability}
    </span>
  )
}
