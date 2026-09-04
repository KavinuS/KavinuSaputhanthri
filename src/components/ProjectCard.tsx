import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from './ui/Reveal'
import type { Project } from '@/data/projects'

/**
 * A large editorial project card. Layout alternates side to side on desktop,
 * driven by the row index, and stacks image-first on mobile.
 */
export function ProjectCard({ project, flipped }: { project: Project; flipped: boolean }) {
  const hasDetail = project.highlights.length > 0

  return (
    <Reveal as="li" className="border-t border-line pt-8 lg:pt-12">
      <article className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
        {/* Visual */}
        <div className={flipped ? 'lg:order-2 lg:col-span-7' : 'lg:col-span-7'}>
          <Link
            href={`/work/${project.slug}`}
            className="group block overflow-hidden rounded-lg border border-line bg-paper-raised"
            tabIndex={-1}
            aria-hidden="true"
          >
            <Image
              src={project.image}
              alt=""
              width={1200}
              height={750}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </Link>
        </div>

        {/* Copy */}
        <div className={flipped ? 'lg:order-1 lg:col-span-5' : 'lg:col-span-5'}>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-sm text-ink-muted">{project.index}</span>
            <span className="text-xs uppercase tracking-[0.14em] text-ink-muted">
              {project.category}
            </span>
          </div>

          <h3 className="mt-4 font-display text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-none tracking-tight">
            <Link
              href={`/work/${project.slug}`}
              className="transition-colors duration-300 hover:text-ink-muted motion-reduce:transition-none"
            >
              {project.title}
            </Link>
          </h3>

          <p className="mt-5 max-w-md text-pretty leading-relaxed text-ink-soft">
            {project.summary}
          </p>

          <p className="mt-6 font-display text-sm text-ink-muted">
            {project.primaryStack.join(' / ')}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            {hasDetail ? (
              <Link
                href={`/work/${project.slug}`}
                className="group inline-flex items-center gap-2 border-b border-ink pb-0.5 font-medium"
              >
                View Project
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
                >
                  →
                </span>
              </Link>
            ) : null}

            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-ink-muted transition-colors duration-300 hover:text-ink motion-reduce:transition-none"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                >
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  )
}
