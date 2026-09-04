import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-screen items-center">
      <Container>
        <p className="font-display text-sm text-ink-muted">404</p>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,9vw,7rem)] font-bold uppercase leading-[0.88] tracking-[-0.035em]">
          Page not found
        </h1>
        <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
          That page does not exist. The work, the writing and the contact details are all on the
          home page.
        </p>
        <Link
          href="/"
          className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:bg-ink-soft motion-reduce:transition-none"
        >
          Back home
          <span aria-hidden="true">→</span>
        </Link>
      </Container>
    </main>
  )
}
