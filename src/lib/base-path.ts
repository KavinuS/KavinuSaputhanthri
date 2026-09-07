/**
 * Prefix for files served straight out of `public/`.
 *
 * `next/link` and the router apply `basePath` on their own, but raw asset URLs
 * — `next/image` sources, download links, metadata icons — do not, so they have
 * to be wrapped here or they 404 under the GitHub Pages sub-path.
 *
 * Must stay in sync with `basePath` in next.config.ts.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Turns a root-relative public path into one the deployed site can serve. */
export function asset(path: string) {
  return `${basePath}${path}`
}
