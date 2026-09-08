import { ProjectCard } from './ProjectCard'
import { Container } from './ui/Container'
import { SectionHeading } from './ui/SectionHeading'
import { projects } from '@/data/projects'

export function Projects() {
  return (
    <section id="work" >
      <Container>
        <SectionHeading
          label="Selected Work"
          intro="Systems built around a specific hard problem — concurrency, messy real-world input, or a workflow that needed structure."
          count={String(projects.length).padStart(2, '0')}
        />

        <ul className="mt-16 flex flex-col gap-20 lg:mt-24 lg:gap-32">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} flipped={index % 2 === 1} />
          ))}
        </ul>
      </Container>
    </section>
  )
}
