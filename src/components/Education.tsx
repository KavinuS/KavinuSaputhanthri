import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'
import { education } from '@/data/education'

export function Education() {
  return (
    <section id="education" className="py-section">
      <Container>
        <SectionHeading label="Education" />

        <ol className="mt-14 lg:mt-20">
          {education.map((entry) => (
            <Reveal as="li" key={entry.institution} className="border-t border-line">
              <div className="grid gap-6 py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
                <div className="lg:col-span-3">
                  <span className="font-display text-sm text-ink-muted">{entry.period}</span>
                </div>

                <div className="lg:col-span-9">
                  <h3 className="font-display text-[clamp(1.5rem,3.4vw,2.5rem)] font-bold leading-none tracking-tight">
                    {entry.institution}
                  </h3>

                  {entry.faculty ? (
                    <p className="mt-3 text-sm text-ink-muted">{entry.faculty}</p>
                  ) : null}

                  <p className="mt-2 text-ink-soft">{entry.qualification}</p>

                  {entry.facts ? (
                    <dl className="mt-7 grid gap-x-12 gap-y-4 border-t border-line pt-6 sm:grid-cols-2">
                      {entry.facts.map((fact) => (
                        <div key={fact.label}>
                          <dt className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                            {fact.label}
                          </dt>
                          <dd className="mt-1.5 font-display text-sm">{fact.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="border-t border-line" />
      </Container>
    </section>
  )
}
