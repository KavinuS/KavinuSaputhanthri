import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'
import { achievements } from '@/data/achievements'

/** Placement decides how much typographic weight a row earns. */
const tierStyles = {
  champion: {
    event: 'font-display text-[clamp(1.65rem,4vw,3rem)] font-bold leading-none tracking-tight',
    placement: 'text-ink',
  },
  'runner-up': {
    event: 'font-display text-[clamp(1.4rem,3.1vw,2.25rem)] font-medium leading-none tracking-tight',
    placement: 'text-ink',
  },
  finalist: {
    event: 'font-display text-[clamp(1.15rem,2.3vw,1.6rem)] font-medium leading-none tracking-tight',
    placement: 'text-ink-muted',
  },
} as const

export function Achievements() {
  return (
    <section id="achievements" className="py-section">
      <Container>
        <SectionHeading
          label="Achievements"
          intro="Competitive results from hackathons, CTFs and inter-university engineering competitions."
          count={String(achievements.length).padStart(2, '0')}
        />

        <ul className="mt-14 lg:mt-20">
          {achievements.map((item) => {
            const styles = tierStyles[item.tier]

            return (
              <Reveal as="li" key={`${item.event}-${item.year}`} className="border-t border-line">
                <div className="group grid grid-cols-[3.5rem_1fr] items-baseline gap-x-4 gap-y-2 py-6 transition-colors duration-500 hover:bg-paper-raised motion-reduce:transition-none sm:grid-cols-[5rem_1fr_auto] sm:gap-x-8 sm:py-8">
                  <span className="font-display text-sm text-ink-muted">{item.year}</span>

                  <div className="min-w-0">
                    <h3 className={styles.event}>{item.event}</h3>
                    <p className="mt-2 text-sm text-ink-muted">{item.organiser}</p>
                  </div>

                  <p
                    className={`col-start-2 text-sm sm:col-start-3 sm:text-right ${styles.placement}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {item.placement}
                      <span
                        aria-hidden="true"
                        className="hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none sm:inline"
                      >
                        →
                      </span>
                    </span>
                  </p>
                </div>
              </Reveal>
            )
          })}
        </ul>
        <div className="border-t border-line" />
      </Container>
    </section>
  )
}
