/**
 * Single source of truth for identity, contact details and navigation.
 * Every link that appears anywhere in the UI originates here.
 */

export const site = {
  name: 'Kavinu Saputhanthri',
  firstName: 'Kavinu',
  lastName: 'Saputhanthri',
  roles: ['Software Engineer', 'Full-Stack Developer', 'AI/ML Enthusiast'],
  tagline:
    'I enjoy building scalable backend systems, full-stack applications and intelligent software products.',
  availability: 'Available for Internship Opportunities',
  location: 'Colombo 07, Sri Lanka',
  email: 'kavinusaputhanthri2002@gmail.com',
  github: 'https://github.com/KavinuS',
  linkedin: 'https://www.linkedin.com/in/kavinu-saputhanthri-789290329/',
  resume: '/Kavinu-Saputhanthri-CV.pdf',
  /** Composed hero artwork: the name lockup and portrait in one image. */
  heroImage: '/images/hero-name-portrait.png',
  url: 'https://kavinu.dev',
} as const

// Root-relative so the same nav works from the home page and from /work/[slug].
export const navLinks = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Achievements', href: '/#achievements' },
  { label: 'Contact', href: '/#contact' },
] as const

export const socialLinks = [
  { label: 'GitHub', href: site.github },
  { label: 'LinkedIn', href: site.linkedin },
  { label: 'Email', href: `mailto:${site.email}` },
] as const
