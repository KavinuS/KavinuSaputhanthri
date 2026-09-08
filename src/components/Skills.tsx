import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'
import { skillGroups } from '@/data/skills'

/** Typographic, deliberately without proficiency bars or invented percentages. */
export function Skills() {
  return (
    <section id="skills" >
      <Container>
        <SectionHeading label="Tech Stack" />

        <div className="mt-14 grid gap-x-14 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {skillGroups.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.05}>
              <h3 className="border-t border-line pt-4 text-xs uppercase tracking-[0.18em] text-ink-muted">
                {group.title}
              </h3>

              <ul className="mt-5 flex flex-wrap gap-x-2 gap-y-2.5">
                {group.items.map((item, itemIndex) => (
                  <li key={item} className="font-display text-lg leading-snug tracking-tight">
                    {item}
                    {itemIndex < group.items.length - 1 ? (
                      <span aria-hidden="true" className="ml-2 text-ink-muted">
                        ·
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
