import { Reveal } from './Reveal'

type SectionHeadingProps = {
  /** Rendered after a slash, e.g. "WORK" becomes /WORK. */
  label: string
  /** Optional sentence sitting opposite the label. */
  intro?: string
  /** Small counter shown at the far right, e.g. "06". */
  count?: string
  dark?: boolean
}

export function SectionHeading({ label, intro, count, dark = false }: SectionHeadingProps) {
  const rule = dark ? 'border-night-line' : 'border-line'
  const muted = dark ? 'text-night-muted' : 'text-ink-muted'

  return (
    <Reveal className={`border-t ${rule} pt-6`}>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        <h2 className="section-label flex items-baseline gap-1 text-[clamp(2.25rem,6vw,5rem)] leading-[0.9]">
          <span className={muted} aria-hidden="true">
            /
          </span>
          <span>{label}</span>
        </h2>

        {intro ? (
          <p className={`max-w-md text-balance text-base leading-relaxed lg:pt-3 ${muted}`}>
            {intro}
          </p>
        ) : null}

        {count ? (
          <span className={`hidden font-display text-sm lg:block lg:pt-4 ${muted}`}>[{count}]</span>
        ) : null}
      </div>
    </Reveal>
  )
}
