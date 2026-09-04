# Kavinu Saputhanthri — Portfolio

Editorial, monochrome personal portfolio. Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Framer Motion.

```bash
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
npm run lint    # oxlint
```

## Where the content lives

Nothing about you is hardcoded in JSX. Edit these files and the whole site follows:

| File | Contains |
| --- | --- |
| `src/data/site.ts` | Name, roles, tagline, email, social links, résumé path, nav items |
| `src/data/projects.ts` | Every project, its highlights, stack, links and architecture flow |
| `src/data/experience.ts` | Work experience rows |
| `src/data/achievements.ts` | Competition results and their placement tier |
| `src/data/education.ts` | Education timeline |
| `src/data/skills.ts` | Grouped tech stack |

Adding a project to `projects.ts` automatically creates its card on the home page **and** a
statically generated detail page at `/work/<slug>` — no routing changes needed.

## Replace these placeholders

The site ships with generated stand-ins so nothing renders as a broken image. Swap them for the
real thing:

1. **`public/images/hero-name-portrait.png`** — the composed hero artwork (name lockup +
   portrait, currently 1549 × 1015). It is drawn with `mix-blend-multiply`, which blends its flat
   white background into the paper colour — so keep the background **white and flat**, and keep
   the artwork greyscale. If you swap in a differently-shaped image, update the `width`/`height`
   on the `<Image>` in `src/components/Hero.tsx` to match, or it will letterbox.
2. **`public/projects/*.svg`** — project screenshots. Replace each file, then update the `image`
   field in `src/data/projects.ts` if you change the extension (e.g. `/projects/flashx.png`).
3. **`public/Kavinu-Saputhanthri-CV.pdf`** — your real CV, same filename.
4. **`src/data/site.ts` → `url`** — set to your real domain once deployed. It drives canonical
   URLs and Open Graph metadata.

`node scripts/generate-placeholders.mjs` regenerates the stand-ins. Nothing at build time depends
on it.

## Content rule

Every technical claim in `projects.ts` was verified against the public repositories on
github.com/KavinuS — READMEs, dependency manifests and actual source trees.

Deliberately excluded: FlashX's 5,000 RPS and sub-15 ms figures. Its README labels them as
*goals, not results*, until load testing is complete. Add them once they are measured.

## Design system

Tokens live in one place, `src/app/globals.css` under `@theme`:

- **Paper** `#f5f5f2` · **Ink** `#111111` · **Night** `#171717` (the Experience section and footer)
- **Signal green** appears only on the availability dot. Nothing else in the UI is coloured —
  project imagery is expected to supply the colour.
- Type: Space Grotesk (display) + Inter (body), both self-hosted via `next/font`.
- `--spacing-section` drives the section rhythm; use it as `py-section`.

## Opening the dev server from another device

Next blocks dev-only resources (HMR, fonts, JS chunks) requested from a host it does not
recognise. If you open the dev server from your phone or another machine and the page looks
broken, add that device's IP to `allowedDevOrigins` in `next.config.ts` and **restart** the dev
server — the setting is only read at startup.

## Accessibility & motion

- Every animation is wrapped in `Reveal`, which returns unanimated markup when the visitor has
  `prefers-reduced-motion` set. Hover transitions carry `motion-reduce:transition-none`.
- One `<h1>` per page, ordered headings, skip link, visible focus ring on every interactive
  element, and `rel="noopener noreferrer"` on all external links.

## Supabase

`src/lib/supabase.ts` holds a configured client left over from earlier setup. **The portfolio does
not use it** — it is there if you later want a contact form or a view counter. Delete the file and
drop `@supabase/supabase-js` from `package.json` if you don't want it.

Note that `NEXT_PUBLIC_*` variables are inlined into the client bundle, so the publishable key is
public by design. Row Level Security is the only thing protecting any table you query from the
browser.
