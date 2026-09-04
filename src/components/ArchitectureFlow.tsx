import { Reveal } from './ui/Reveal'
import type { ArchitectureStep } from '@/data/projects'

/**
 * A vertical request-path diagram.
 *
 * Rendered from data rather than drawn, so it can only ever show steps that
 * were verified from the repository. The connectors are decorative; the list
 * itself is an ordered list, which is what a screen reader announces.
 */
export function ArchitectureFlow({
  title,
  steps,
}: {
  title: string
  steps: ArchitectureStep[]
}) {
  return (
    <div>
      <Reveal>
        <h2 className="border-t border-line pt-8 text-xs uppercase tracking-[0.18em] text-ink-muted">
          Architecture — {title}
        </h2>
      </Reveal>

      <ol className="mt-10 max-w-2xl">
        {steps.map((step, index) => (
          <Reveal as="li" key={step.name} delay={index * 0.05}>
            <div className="flex items-start gap-5 rounded-lg border border-line bg-paper-raised px-5 py-4 sm:px-6 sm:py-5">
              <span className="mt-0.5 font-display text-sm text-ink-muted">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <p className="font-display text-base font-medium tracking-tight sm:text-lg">
                  {step.name}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{step.detail}</p>
              </div>
            </div>

            {index < steps.length - 1 ? (
              <div
                aria-hidden="true"
                className="flex flex-col items-center py-2 text-ink-muted"
              >
                <span className="block h-4 w-px bg-line-strong" />
                <span className="-mt-1 text-xs leading-none">▾</span>
              </div>
            ) : null}
          </Reveal>
        ))}
      </ol>
    </div>
  )
}
