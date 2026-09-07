import type { NextConfig } from 'next'

// GitHub Pages serves this repo from https://<user>.github.io/<repo>/, so every
// URL Next emits has to carry that prefix. Supplied by the deploy workflow;
// empty locally so `next dev` still serves from the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // GitHub Pages is a plain static host: no Node server, so the whole site is
  // pre-rendered to HTML/CSS/JS in `out/` at build time.
  output: 'export',
  basePath,
  assetPrefix: basePath,
  // Emits `/work/foo/index.html` instead of `/work/foo.html`, which is what a
  // bare static host resolves reliably.
  trailingSlash: true,
  images: {
    // The default loader needs the Next image optimisation server, which a
    // static export does not have.
    unoptimized: true,
  },
  // Pins the workspace root to this folder. Without it Turbopack walks up and
  // finds an unrelated package-lock.json in the user profile directory.
  turbopack: {
    root: __dirname,
  },
  // Hosts allowed to request dev-only resources (/_next/hmr, fonts, chunks).
  // Needed to open the dev server from another device on the same network —
  // without it those requests are blocked and the page renders with no styles
  // and no JavaScript. Add your machine's LAN IP here if it changes.
  allowedDevOrigins: ['192.168.43.30', '172.22.183.30'],
}

export default nextConfig
