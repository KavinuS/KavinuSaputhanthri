import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { ArchitectureFlow } from '@/components/ArchitectureFlow'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { getProject, projects } from '@/data/projects'
import { asset } from '@/lib/base-path'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) return { title: 'Project not found' }

  return {
    title: `${project.title} — ${project.category}`,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) notFound()

  return (
    <>
      <main id="main" className="pb-section pt-28 lg:pt-32">
        <Container>
          <Link
            href="/#work"
            className="group inline-flex items-center gap-2 text-sm text-ink-muted transition-colors duration-300 hover:text-ink motion-reduce:transition-none"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:-translate-x-0.5 motion-reduce:transition-none"
            >
              ←
            </span>
            Selected Work
          </Link>

          {/* ---- Title block ---- */}
          <header className="mt-10 border-t border-line pt-8 lg:mt-14">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-sm text-ink-muted">{project.index}</span>
              <span className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                {project.category}
              </span>
            </div>

            <h1 className="mt-5 font-display text-[clamp(2.75rem,10vw,8rem)] font-bold uppercase leading-[0.86] tracking-[-0.035em]">
              {project.title}
            </h1>

            <p className="mt-8 max-w-2xl text-balance font-display text-[clamp(1.2rem,2.4vw,1.75rem)] font-medium leading-snug tracking-tight">
              {project.summary}
            </p>

            {project.links.length > 0 ? (
              <div className="mt-9 flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 rounded-full border border-line-strong px-5 py-2.5 text-sm transition-colors duration-300 hover:border-ink motion-reduce:transition-none"
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
            ) : null}

            {project.note ? <p className="mt-6 text-sm text-ink-muted">{project.note}</p> : null}
          </header>

          {/* ---- Visual ---- */}
          <Reveal className="mt-14 overflow-hidden rounded-lg border border-line bg-paper-raised lg:mt-20">
            <Image
              src={asset(project.image)}
              alt=""
              width={project.imageSize.width}
              height={project.imageSize.height}
              priority
              sizes="100vw"
              className="h-auto w-full"
            />
          </Reveal>

          {/* ---- Overview & problem ---- */}
          <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <h2 className="text-xs uppercase tracking-[0.18em] text-ink-muted">Overview</h2>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-ink-soft">
                {project.overview}
              </p>

              {project.problem ? (
                <>
                  <h2 className="mt-14 text-xs uppercase tracking-[0.18em] text-ink-muted">
                    The problem
                  </h2>
                  <p className="mt-6 text-pretty text-lg leading-relaxed text-ink-soft">
                    {project.problem}
                  </p>
                </>
              ) : null}
            </Reveal>

            <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
              <h2 className="text-xs uppercase tracking-[0.18em] text-ink-muted">Technology</h2>
              <ul className="mt-6 border-t border-line">
                {project.stack.map((tech) => (
                  <li key={tech} className="border-b border-line py-3 font-display text-sm">
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* ---- Architecture ---- */}
          {project.architecture ? (
            <div className="mt-20 lg:mt-28">
              <ArchitectureFlow
                title={project.architecture.title}
                steps={project.architecture.steps}
              />
            </div>
          ) : null}

          {/* ---- Engineering highlights ---- */}
          <div className="mt-20 lg:mt-28">
            <Reveal>
              <h2 className="border-t border-line pt-8 text-xs uppercase tracking-[0.18em] text-ink-muted">
                Engineering highlights
              </h2>
            </Reveal>

            <ol className="mt-10 grid gap-x-16 gap-y-10 lg:grid-cols-2">
              {project.highlights.map((highlight, index) => (
                <Reveal as="li" key={highlight} delay={(index % 2) * 0.06}>
                  <span className="font-display text-sm text-ink-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-3 text-pretty leading-relaxed text-ink-soft">{highlight}</p>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* ---- Next project ---- */}
          <NextProject slug={project.slug} />
        </Container>
      </main>
      <Footer />
    </>
  )
}

function NextProject({ slug }: { slug: string }) {
  const currentIndex = projects.findIndex((project) => project.slug === slug)
  const next = projects[(currentIndex + 1) % projects.length]

  if (!next || next.slug === slug) return null

  return (
    <Reveal className="mt-24 border-t border-line pt-8 lg:mt-32">
      <Link href={`/work/${next.slug}`} className="group block">
        <span className="text-xs uppercase tracking-[0.18em] text-ink-muted">Next project</span>
        <span className="mt-4 flex items-baseline justify-between gap-6">
          <span className="font-display text-[clamp(2rem,6vw,4.5rem)] font-bold uppercase leading-none tracking-tight transition-colors duration-300 group-hover:text-ink-muted motion-reduce:transition-none">
            {next.title}
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 text-2xl text-ink-muted transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </span>
      </Link>
    </Reveal>
  )
}
