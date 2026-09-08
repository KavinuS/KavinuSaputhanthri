import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'
import { experience } from '@/data/experience'

/**
 * The one dark block on the page. The oversized outlined word behind the
 * content is decorative and hidden from assistive technology.
 */
export function Experience() {
  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-night  text-white"
    >
      <span
        aria-hidden="true"
        className="text-outline-invert pointer-events-none absolute -bottom-[2vw] left-1/2 hidden -translate-x-1/2 select-none font-display text-[19vw] font-bold uppercase leading-none tracking-tighter opacity-[0.07] lg:block"
      >
        Experience
      </span>

      <Container className="relative">
        <SectionHeading label="Experience" dark />

        <ul className="mt-14 lg:mt-20">
          {experience.map((role) => (
            <Reveal as="li" key={role.company} className="border-t border-night-line">
              <div className="group py-10 lg:py-14">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                  <h3 className="font-display text-[clamp(1.75rem,4.4vw,3.25rem)] font-bold leading-none tracking-tight">
                    {role.company}
                  </h3>
                  <span className="shrink-0 font-display text-sm text-night-muted">
                    {role.period}
                  </span>
                </div>

                <p className="mt-4 text-sm text-night-muted sm:text-base">{role.role}</p>

                <ul className="mt-8 grid gap-x-12 gap-y-4 border-t border-night-line pt-8 sm:grid-cols-2">
                  {role.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex gap-3 text-sm leading-relaxed text-night-muted transition-colors duration-500 group-hover:text-white/85 motion-reduce:transition-none"
                    >
                      <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-night-line" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
