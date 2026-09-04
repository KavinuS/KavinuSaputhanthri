import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
