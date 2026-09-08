import Image from 'next/image'
import { Container } from './ui/Container'
import { site } from '@/data/site'
import { asset } from '@/lib/base-path'

/**
 * The hero is a server component and its entrance is a pure CSS animation.
 *
 * Nothing here waits for JavaScript: the markup ships fully visible and the
 * animation plays from CSS, so a slow, blocked or disabled bundle can never
 * leave the page looking empty.
 *
 * The name lockup and portrait arrive as one composed image, so the visible
 * heading lives in the artwork. The <h1> is kept for screen readers and search
 * engines, which cannot read type baked into a PNG.
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-20 lg:pt-4">
      <Container>
        <h1 className="sr-only">
          {site.name} — {site.roles.join(', ')}
        </h1>

        {/* ---- Composed name + portrait -----------------------------------
            The source artwork sits on a flat white background. `multiply`
            blends that white into the paper colour instead of stamping a white
            rectangle onto the page, so only the black type and the greyscale
            portrait remain. */}
        <div className="relative z-10">
          <Image
            src={asset(site.heroImage)}
            alt={`${site.name} — ${site.roles.join(', ')}`}
            width={1549}
            height={1015}
            priority
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="animate-glow-up mx-auto h-auto w-full max-w-275 select-none mix-blend-multiply"
          />
        </div>

        {/* ---- Supporting rail --------------------------------------------
            On desktop this rises into the empty corners either side of the
            portrait. Below lg the layout stacks and sits clear of the image. */}
        <div className="relative z-20 mt-8 grid gap-10 pb-section sm:mt-10 lg:-mt-40 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="animate-rise lg:col-span-4" style={{ animationDelay: '0.35s' }}>
            <ul className="font-display text-[clamp(1.35rem,3.2vw,2rem)] font-medium leading-[1.15] tracking-tight">
              {site.roles.map((role, index) => (
                <li key={role} className={index > 0 ? 'text-ink-muted' : undefined}>
                  {role}
                </li>
              ))}
            </ul>

            <p className="mt-5 max-w-sm text-pretty text-[0.95rem] leading-relaxed text-ink-soft">
              {site.tagline}
            </p>

            <a
              href="/#work"
              className="group mt-7 inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ink-soft motion-reduce:transition-none"
            >
              View My Work
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:translate-y-0.5 motion-reduce:transition-none"
              >
                ↓
              </span>
            </a>
          </div>

          {/* Keeps the two rails clear of the centred portrait between them. */}
          <div className="hidden lg:col-span-4 lg:block" />

          <div
            className="animate-rise flex flex-wrap gap-2.5 lg:col-span-4 lg:flex-col lg:items-end"
            style={{ animationDelay: '0.45s' }}
          >
            {[
              { label: 'GitHub', href: site.github, download: false },
              { label: 'LinkedIn', href: site.linkedin, download: false },
              { label: 'Resume', href: asset(site.resume), download: true },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.download
                  ? { download: '' }
                  : { target: '_blank', rel: 'noopener noreferrer' })}
                className="group inline-flex items-center gap-3 rounded-full border border-line-strong bg-paper-raised px-5 py-2.5 text-sm transition-colors duration-300 hover:border-ink motion-reduce:transition-none lg:w-44 lg:justify-between"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="text-ink-muted transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                >
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
