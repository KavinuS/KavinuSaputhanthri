import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

const interests = [
  'Scalable architectures',
  'Distributed systems',
  'Software engineering',
  'AI & machine learning',
  'Product development',
]

export function About() {
  return (
    <section id="about" className="py-section">
      <Container>
        <SectionHeading label="About" />

        <div className="mt-8 grid gap-12 lg:mt-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="text-balance font-display text-[clamp(1.4rem,2.9vw,2.35rem)] font-medium leading-[1.25] tracking-tight">
              I&apos;m a third-year Information Technology undergraduate at the University of
              Moratuwa with a strong interest in software engineering, backend systems, full-stack
              development and AI/ML.
            </p>

            <p className="mt-8 max-w-xl text-pretty leading-relaxed text-ink-soft">
              I enjoy turning ideas into real software products — from scalable backend
              architectures and REST APIs to intelligent applications powered by AI and LLM
              technologies. Most of what I build starts with a problem that only shows up under
              pressure: concurrency, messy real-world input, or a system that has to stay correct
              while it is being pulled in several directions at once.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <h3 className="text-xs uppercase tracking-[0.18em] text-ink-muted">
              What I like learning
            </h3>

            <ul className="mt-6 border-t border-line">
              {interests.map((interest) => (
                <li
                  key={interest}
                  className="group flex items-center justify-between border-b border-line py-4 text-sm transition-colors duration-300 hover:text-ink-muted motion-reduce:transition-none"
                >
                  {interest}
                  <span
                    aria-hidden="true"
                    className="text-ink-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
