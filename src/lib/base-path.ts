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

/**
 * Turns a root-relative public path into one the deployed site can serve.
 *
 * The path is URI-encoded because screenshot folders arrive named the way the
 * camera roll or the download named them — spaces, parentheses — and a raw
 * space in an `src` is not a valid URL. `encodeURI` leaves `/` alone, so the
 * path structure survives, and it is a no-op for names that need no escaping.
 */
export function asset(path: string) {
  return `${basePath}${encodeURI(path)}`
}
