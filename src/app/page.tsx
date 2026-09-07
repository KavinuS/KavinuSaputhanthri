import { About } from '@/components/About'
import { Achievements } from '@/components/Achievements'
import { Contact } from '@/components/Contact'
import { Education } from '@/components/Education'
import { Experience } from '@/components/Experience'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { Projects } from '@/components/Projects'
import { Reveal } from '@/components/ui/Reveal'
import { Skills } from '@/components/Skills'

/**
 * Every section below the hero slides up as it enters the viewport.
 *
 * The travel here is longer and slower than the per-element reveals inside the
 * sections, so a block arrives as one piece and its contents settle a moment
 * behind it. The hero is deliberately not wrapped: it is on screen immediately
 * and runs its own CSS entrance instead.
 */
const SECTION_TRAVEL = 64
const SECTION_DURATION = 0.9

export default function HomePage() {
  return (
    <>
      <main id="main">
        <Hero />

        <Reveal distance={SECTION_TRAVEL} duration={SECTION_DURATION}>
          <About />
        </Reveal>

        <Reveal distance={SECTION_TRAVEL} duration={SECTION_DURATION}>
          <Projects />
        </Reveal>

        <Reveal distance={SECTION_TRAVEL} duration={SECTION_DURATION}>
          <Experience />
        </Reveal>

        <Reveal distance={SECTION_TRAVEL} duration={SECTION_DURATION}>
          <Achievements />
        </Reveal>

        <Reveal distance={SECTION_TRAVEL} duration={SECTION_DURATION}>
          <Education />
        </Reveal>

        <Reveal distance={SECTION_TRAVEL} duration={SECTION_DURATION}>
          <Skills />
        </Reveal>

        <Reveal distance={SECTION_TRAVEL} duration={SECTION_DURATION}>
          <Contact />
        </Reveal>
      </main>
      <Footer />
    </>
  )
}
