/**
 * Generates the placeholder assets that ship with the portfolio so every image
 * slot renders something considered rather than a broken-image icon.
 *
 * Re-run with `node scripts/generate-placeholders.mjs` after changing project
 * data. Replace the generated files with real artwork whenever you have it —
 * nothing in the app depends on this script at build time.
 */
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')

/* -------------------------------------------------------------------------
   A minimal PNG encoder — enough for one RGBA image, no dependencies.
------------------------------------------------------------------------- */

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typeAndData))
  return Buffer.concat([length, typeAndData, crc])
}

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // colour type: RGBA
  // 10-12 stay zero: deflate, adaptive filtering, no interlace.

  // One filter byte (0 = None) in front of every scanline.
  const raw = Buffer.alloc(height * (width * 4 + 1))
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 4 + 1)
    raw[rowStart] = 0
    rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4)
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/* -------------------------------------------------------------------------
   Portrait placeholder: a soft grayscale bust on a transparent background,
   matching the shape a real cutout would occupy in the hero.
------------------------------------------------------------------------- */

function generatePortrait(width, height) {
  const rgba = Buffer.alloc(width * height * 4)

  const headCx = width / 2
  const headCy = height * 0.3
  const headRx = width * 0.205
  const headRy = height * 0.235

  const bodyCx = width / 2
  const bodyCy = height * 1.06
  const bodyRx = width * 0.44
  const bodyRy = height * 0.53

  // Antialias by sampling a 2x2 grid inside every pixel.
  const offsets = [0.25, 0.75]

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let hits = 0

      for (const oy of offsets) {
        for (const ox of offsets) {
          const px = x + ox
          const py = y + oy
          const head = ((px - headCx) / headRx) ** 2 + ((py - headCy) / headRy) ** 2
          const body = ((px - bodyCx) / bodyRx) ** 2 + ((py - bodyCy) / bodyRy) ** 2
          if (head <= 1 || body <= 1) hits += 1
        }
      }

      if (hits === 0) continue

      // Vertical ramp from light grey at the top to darker at the base.
      const shade = Math.round(214 - (y / height) * 66)
      const index = (y * width + x) * 4
      rgba[index] = shade
      rgba[index + 1] = shade
      rgba[index + 2] = shade
      rgba[index + 3] = Math.round((hits / 4) * 255)
    }
  }

  return encodePng(width, height, rgba)
}

/* -------------------------------------------------------------------------
   Project preview placeholders: neutral editorial cards carrying the project
   name and stack, so the layout reads correctly before real screenshots exist.
------------------------------------------------------------------------- */

const escapeXml = (value) =>
  value.replace(/[<>&'"]/g, (char) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char],
  )

function projectPlaceholder({ index, title, category, stack }) {
  const gridLines = Array.from({ length: 11 }, (_, i) => {
    const x = 100 + i * 140
    return `<line x1="${x}" y1="0" x2="${x}" y2="1000" stroke="#111111" stroke-opacity="0.05" />`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000" role="img" aria-label="${escapeXml(title)} preview placeholder">
  <rect width="1600" height="1000" fill="#f0f0ec" />
  ${gridLines}
  <line x1="0" y1="760" x2="1600" y2="760" stroke="#111111" stroke-opacity="0.08" />
  <text x="100" y="200" font-family="'Space Grotesk',Inter,system-ui,sans-serif" font-size="34" fill="#777777">${escapeXml(index)}</text>
  <text x="100" y="420" font-family="'Space Grotesk',Inter,system-ui,sans-serif" font-size="150" font-weight="700" letter-spacing="-6" fill="#111111">${escapeXml(title)}</text>
  <text x="100" y="490" font-family="Inter,system-ui,sans-serif" font-size="30" fill="#777777">${escapeXml(category)}</text>
  <text x="100" y="840" font-family="'Space Grotesk',Inter,system-ui,sans-serif" font-size="30" fill="#4a4a4a">${escapeXml(stack)}</text>
  <text x="100" y="900" font-family="Inter,system-ui,sans-serif" font-size="24" fill="#a3a39c">Replace with a real screenshot — public/projects/</text>
</svg>
`
}

const projectPlaceholders = [
  {
    file: 'flashx.svg',
    index: '01',
    title: 'FlashX',
    category: 'Distributed Systems · High-Concurrency Backend',
    stack: 'Spring Boot / Redis / RabbitMQ / PostgreSQL / Next.js',
  },
  {
    file: 'mediinsight.svg',
    index: '02',
    title: 'MediInsight AI',
    category: 'Applied AI · Document Intelligence',
    stack: 'FastAPI / Qdrant / Tesseract / spaCy / React',
  },
  {
    file: 'ai-code-reviewer.svg',
    index: '03',
    title: 'AI Code Reviewer',
    category: 'Full-Stack · Developer Tooling',
    stack: 'Django REST / Angular / PostgreSQL / OAuth 2.0',
  },
  {
    file: 'biofusion.svg',
    index: '04',
    title: 'BioFusion',
    category: 'Machine Learning · Medical Imaging',
    stack: 'PyTorch / Vision Transformers / timm',
  },
  {
    file: 'auditra.svg',
    index: '05',
    title: 'Auditra',
    category: 'Team Project · Real-Time Web',
    stack: 'WebSockets / Firebase Cloud Messaging',
  },
  {
    file: 'gold-victoria.svg',
    index: '06',
    title: 'Gold Victoria',
    category: 'Backend · REST API',
    stack: 'Java / Spring Boot / Spring Data JPA / MySQL',
  },
]

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#111111" />
  <text x="32" y="45" text-anchor="middle" font-family="'Space Grotesk',Inter,system-ui,sans-serif" font-size="38" font-weight="700" fill="#f5f5f2">K</text>
</svg>
`

/** A valid one-page PDF so the Resume button downloads something real. */
function placeholderPdf() {
  const text = 'Kavinu Saputhanthri - CV placeholder. Replace this file with your real CV.'
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${text.length + 44} >>\nstream\nBT /F1 14 Tf 60 760 Td (${text}) Tj ET\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = []
  objects.forEach((body, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
  })

  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`

  return Buffer.from(pdf, 'latin1')
}

/* ---------------------------------- run ---------------------------------- */

mkdirSync(join(publicDir, 'images'), { recursive: true })
mkdirSync(join(publicDir, 'projects'), { recursive: true })

writeFileSync(join(publicDir, 'images', 'kavinu-portrait.png'), generatePortrait(900, 1040))
console.log('public/images/kavinu-portrait.png')

for (const project of projectPlaceholders) {
  writeFileSync(join(publicDir, 'projects', project.file), projectPlaceholder(project))
  console.log(`public/projects/${project.file}`)
}

writeFileSync(join(publicDir, 'favicon.svg'), favicon)
console.log('public/favicon.svg')

writeFileSync(join(publicDir, 'Kavinu-Saputhanthri-CV.pdf'), placeholderPdf())
console.log('public/Kavinu-Saputhanthri-CV.pdf')
