import { Container } from './ui/Container'
import { Reveal } from './ui/Reveal'
import { site } from '@/data/site'
import { asset } from '@/lib/base-path'

const channels = [
  { label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { label: 'WhatsApp', value: site.whatsapp.display, href: site.whatsapp.href },
  { label: 'LinkedIn', value: 'in/kavinu-saputhanthri', href: site.linkedin },
  { label: 'GitHub', value: 'github.com/KavinuS', href: site.github },
]

export function Contact() {
  return (
    <section id="contact" className="border-t border-line ">
      <Container>
        <Reveal>
          <h2 className="text-balance font-display text-[clamp(2.5rem,9vw,8rem)] font-bold uppercase leading-[0.88] tracking-[-0.035em]">
            Have an opportunity
            <br />
            <span className="text-outline">in mind?</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
            I&apos;m currently open to Software Engineering, Backend, Full-Stack and AI/ML
            internship opportunities.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <ul className="mt-14 border-t border-line">
            {channels.map((channel) => (
              <li key={channel.label} className="border-b border-line">
                <a
                  href={channel.href}
                  {...(channel.href.startsWith('mailto:')
                    ? {}
                    : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-6"
                >
                  <span className="text-xs uppercase tracking-[0.18em] text-ink-muted">
                    {channel.label}
                  </span>
                  <span className="font-display text-[clamp(1.1rem,2.6vw,1.75rem)] tracking-tight transition-colors duration-300 group-hover:text-ink-muted motion-reduce:transition-none">
                    {channel.value}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-ink-muted transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-ink-muted">
            <span>{site.location}</span>
            <a
              href={asset(site.resume)}
              download
              className="group inline-flex items-center gap-2 text-ink transition-colors duration-300 hover:text-ink-muted motion-reduce:transition-none"
            >
              Download Resume
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:translate-y-0.5 motion-reduce:transition-none"
              >
                ↓
              </span>
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
