import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { CursorFollower } from '@/components/CursorFollower'
import { Loader } from '@/components/Loader'
import { Navbar } from '@/components/Navbar'
import { site } from '@/data/site'
import { asset } from '@/lib/base-path'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const title = 'Kavinu Saputhanthri | Software Engineer & AI/ML Developer'
const description =
  'Portfolio of Kavinu Saputhanthri, a University of Moratuwa Information Technology undergraduate focused on software engineering, backend development, full-stack applications and AI/ML.'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: '%s | Kavinu Saputhanthri',
  },
  description,
  keywords: [
    'Kavinu Saputhanthri',
    'Software Engineer',
    'Backend Engineer',
    'Full-Stack Developer',
    'AI/ML',
    'University of Moratuwa',
    'Sri Lanka',
  ],
  authors: [{ name: site.name, url: site.github }],
  creator: site.name,
  openGraph: {
    type: 'profile',
    locale: 'en_GB',
    url: site.url,
    siteName: site.name,
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: asset('/favicon.svg'),
  },
}

export const viewport: Viewport = {
  themeColor: '#f5f5f2',
  colorScheme: 'light',
}

/** Structured data so search engines resolve the site to a person, not a page. */
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: site.url,
  email: `mailto:${site.email}`,
  telephone: site.whatsapp.display,
  jobTitle: 'Software Engineer',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Colombo',
    addressCountry: 'LK',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of Moratuwa',
  },
  sameAs: [site.github, site.linkedin],
}

/**
 * Raises the loading curtain before the first frame is painted.
 *
 * Deliberately not part of the React bundle: it must run whether or not that
 * bundle ever loads. It also schedules its own dismissal, so the worst case is
 * a curtain that lingers a few seconds — never one that stays forever.
 *
 * Visitors who ask for reduced motion skip the curtain entirely.
 */
const loadingCurtainScript = `(function(){try{
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var r=document.documentElement;r.classList.add('is-loading');
setTimeout(function(){if(r.classList.contains('is-loading')){
r.classList.remove('is-loading');r.classList.add('is-leaving');
setTimeout(function(){r.classList.remove('is-leaving')},900);}},6000);
}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        {/* Runs before first paint so the curtain is up from the very first
            frame, and carries its own failsafe so a bundle that never arrives
            cannot leave the page covered. */}
        <script dangerouslySetInnerHTML={{ __html: loadingCurtainScript }} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:text-paper"
        >
          Skip to content
        </a>
        <Loader />
        <Navbar />
        {children}
        <CursorFollower />
        <script
          type="application/ld+json"
          // Static, author-controlled object — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  )
}
