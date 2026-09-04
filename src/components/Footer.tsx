import { Container } from './ui/Container'
import { site, socialLinks } from '@/data/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-night py-16 text-white">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-2xl font-bold uppercase tracking-tight">{site.name}</p>
            <p className="mt-2 text-sm text-night-muted">Software Engineer</p>
          </div>

          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.href.startsWith('mailto:')
                    ? {}
                    : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="group inline-flex items-center gap-1.5 text-night-muted transition-colors duration-300 hover:text-white motion-reduce:transition-none"
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                  >
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-night-line pt-6 text-xs text-night-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <p>{site.location}</p>
        </div>
      </Container>
    </footer>
  )
}
