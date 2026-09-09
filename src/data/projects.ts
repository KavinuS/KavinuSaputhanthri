/**
 * Project data.
 *
 * Every technical claim below was verified against the public repositories on
 * github.com/KavinuS in September 2026 — READMEs, `pom.xml` / `requirements.txt`
 * dependency lists and actual source trees. Nothing here is estimated.
 *
 * Deliberately NOT included: throughput and latency figures. The FlashX README
 * labels its 5,000 RPS / <15 ms targets as "goals, not results" until load
 * testing is done, so they are not presented here as achievements.
 */

export type ProjectLink = {
  label: string
  href: string
}

export type ArchitectureStep = {
  name: string
  detail: string
}

export type ProjectImage = {
  /** Path under /public. */
  src: string
  /** Intrinsic pixel size — see the note on `Project.imageSize`. */
  width: number
  height: number
  /** Shown under the gallery and used to build the alt text. */
  caption?: string
}

export type Project = {
  slug: string
  index: string
  title: string
  category: string
  /** One-line summary used on the card. */
  summary: string
  /** Longer editorial paragraph used on the detail page. */
  overview: string
  /** The engineering problem the project exists to solve. */
  problem?: string
  /** Verified engineering highlights. */
  highlights: string[]
  /** Full technology list, shown on the detail page. */
  stack: string[]
  /** Headline tech shown on the card — kept short on purpose. */
  primaryStack: string[]
  links: ProjectLink[]
  /** Path under /public/projects. Replace with real screenshots when you have them. */
  image: string
  /**
   * Intrinsic pixel size of `image`. Screenshots come in at whatever ratio the
   * capture had, so the aspect ratio has to travel with the file or the browser
   * reserves the wrong height and the card jumps once the image loads.
   */
  imageSize: { width: number; height: number }
  /**
   * Screenshot tour shown on the detail page as a scrollable gallery.
   *
   * Optional: a project with only a cover falls back to rendering `image` on
   * its own, so there is never a one-slide carousel with dead controls.
   */
  gallery?: ProjectImage[]
  featured: boolean
  /** Optional verified architecture flow, rendered as a diagram. */
  architecture?: { title: string; steps: ArchitectureStep[] }
  /** Shown only when a project genuinely has no public source. */
  note?: string
}

export const projects: Project[] = [
  {
    slug: 'flashx',
    index: '01',
    title: 'FlashX',
    category: 'Distributed Systems · High-Concurrency Backend',
    summary:
      'A flash-sale engine that sells twenty units to twenty thousand simultaneous buyers without ever overselling one.',
    overview:
      'FlashX is a five-service Spring Boot platform built around a single hard problem: a flash sale drops a small amount of stock and thousands of people click Buy inside the same second. It moves the contended inventory decision out of PostgreSQL and into a single atomic Redis Lua script, then persists the order asynchronously through RabbitMQ.',
    problem:
      'The textbook approach — a SELECT … FOR UPDATE row lock inside a transaction — is correct, but it serialises every request behind one lock, exhausts the connection pool, and makes latency grow with queue depth. FlashX replaces that with a lock-free reservation on the single execution thread of Redis, so the customer waits only for one Redis round trip.',
    highlights: [
      'Inventory is reserved by one atomic Redis Lua script that validates the sale window, the per-user cap and idempotency, then decrements stock — all as a single indivisible step, so nothing can interleave between the check and the write.',
      'A request that cannot be satisfied never touches the stock counter, avoiding the decrement-then-compensate pattern that permanently loses a unit of stock if the process dies between the two calls.',
      'Checkout returns 202 Accepted with a correlation id; the order row is written off the request path by a RabbitMQ consumer backed by a dead-letter queue.',
      'Repeating an idempotency key returns the same order id and consumes no additional stock — verified end to end.',
      'Zero oversell is verified in CI: 60 simultaneous checkouts against 20 units of stock produce exactly 20 confirmed orders, covered by 21 Testcontainers integration tests running real Postgres, Redis and RabbitMQ.',
      'Five Spring Boot services behind a Spring Cloud Gateway with Eureka service discovery, schema-per-service PostgreSQL with Flyway migrations, and JWT identity taken from the token subject rather than the request body.',
    ],
    primaryStack: ['Spring Boot', 'Redis', 'RabbitMQ', 'PostgreSQL', 'Next.js'],
    stack: [
      'Java 21',
      'Spring Boot 4.1',
      'Spring Cloud Gateway',
      'Eureka',
      'Spring Security',
      'Redis 7',
      'Lua',
      'RabbitMQ 4',
      'PostgreSQL 16',
      'Flyway',
      'Testcontainers',
      'JUnit 5',
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS',
      'Docker Compose',
    ],
    architecture: {
      title: 'The checkout path',
      steps: [
        { name: 'Next.js storefront', detail: 'Server Components · Server Actions' },
        { name: 'Spring Cloud Gateway', detail: 'single entry point · CORS · Eureka routing' },
        { name: 'order-service', detail: 'identity taken from the JWT subject' },
        { name: 'Redis', detail: 'atomic Lua reservation — the only step the request waits for' },
        { name: 'RabbitMQ', detail: 'order queue with a dead-letter queue' },
        { name: 'PostgreSQL', detail: 'consumer writes the order as CONFIRMED' },
      ],
    },
    links: [
      { label: 'Live storefront', href: 'https://frontend-xi-drab-58.vercel.app' },
      { label: 'Docs & Compose', href: 'https://github.com/KavinuS/FlashX' },
      { label: 'Backend', href: 'https://github.com/KavinuS/Backend-' },
      { label: 'Frontend', href: 'https://github.com/KavinuS/frontend' },
    ],
    image: '/projects/flashx.png',
    imageSize: { width: 1892, height: 910 },
    // Ordered as the buyer meets them: landing, browse, one sale, cart,
    // confirmation, account.
    gallery: [
      {
        src: '/projects/flashx.png',
        width: 1892,
        height: 910,
        caption: 'Landing page — the sale framed by the numbers the system is built to hold.',
      },
      {
        src: '/projects/flashx/home-flash-deals.jpeg',
        width: 1423,
        height: 751,
        caption: 'Live deals, each with the remaining stock counter that checkout claims against.',
      },
      {
        src: '/projects/flashx/flash-sales-board.jpeg',
        width: 1424,
        height: 750,
        caption: 'The full sale board — live, scheduled, sold out and closed — with search.',
      },
      {
        src: '/projects/flashx/sale-detail.jpeg',
        width: 1420,
        height: 746,
        caption: 'A single sale: countdown, remaining allocation, and the cart-is-not-a-reservation note.',
      },
      {
        src: '/projects/flashx/cart.jpeg',
        width: 1424,
        height: 747,
        caption: 'The cart holds an intention to buy; nothing is reserved until checkout runs.',
      },
      {
        src: '/projects/flashx/order-confirmed.jpeg',
        width: 1424,
        height: 749,
        caption:
          'A confirmed order traced end to end — Redis reservation, broker hand-off, ACID write — with its correlation id and idempotency key.',
      },
      {
        src: '/projects/flashx/dashboard.jpeg',
        width: 1420,
        height: 746,
        caption: 'The buyer dashboard: order counts, spend and recent reservations.',
      },
    ],
    featured: true,
  },
  {
    slug: 'mediinsight-ai',
    index: '02',
    title: 'MediInsight AI',
    category: 'Applied AI · Document Intelligence',
    summary:
      'Lab reports in, structured and validated medical values out — then explained in plain English by a safety-checked LLM layer.',
    overview:
      'MediInsight AI turns a photographed or scanned lab report into structured, validated health data. An OCR pipeline feeds a layered extraction stage, values are matched against a medical reference knowledge base, and only then does a pluggable LLM layer explain them — behind a responsible-AI safety checker.',
    problem:
      'Lab reports arrive as images with inconsistent layouts, and a naive OCR-to-LLM pipeline will confidently explain values it misread. This design puts deterministic extraction, spatial parsing, confidence scoring and reference-range validation in front of the model, so the LLM only ever explains data that has already been checked.',
    highlights: [
      'A multi-stage OCR pipeline with its own preprocessing profiles, layout analysis and post-OCR correction rules, backed by an evaluation harness and a release-gate script that scores the pipeline before changes ship.',
      'Extraction combines spaCy, regex rules, spatial parsing and type detection, with explicit confidence scoring and noise filtering rather than trusting raw OCR output.',
      'Extracted values are normalised and matched against a seeded medical reference knowledge base with per-test reference ranges.',
      'A pluggable LLM provider layer — Ollama, OpenAI, Gemini and Groq behind one factory interface, plus an offline template provider — so the application runs with no API key and degrades gracefully.',
      'Retrieval-augmented chat over your own medical history using Qdrant vectors, with a dedicated embedding, indexing and retrieval layer.',
      'Async processing on Celery and Redis, S3-compatible object storage through MinIO, Alembic migrations, and JWT auth on FastAPI with Pydantic v2 and SQLAlchemy 2.0.',
    ],
    primaryStack: ['FastAPI', 'Qdrant', 'Tesseract', 'spaCy', 'PostgreSQL', 'React'],
    stack: [
      'Python',
      'FastAPI',
      'Pydantic v2',
      'SQLAlchemy 2.0',
      'Alembic',
      'PostgreSQL',
      'Redis',
      'Celery',
      'Qdrant',
      'MinIO',
      'Tesseract OCR',
      'spaCy',
      'Ollama / OpenAI / Gemini / Groq',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Docker Compose',
    ],
    architecture: {
      title: 'The report pipeline',
      steps: [
        { name: 'Upload', detail: 'report image or PDF into MinIO object storage' },
        { name: 'OCR', detail: 'preprocessing profiles · layout analysis · correction rules' },
        { name: 'Extraction', detail: 'spaCy · regex · spatial parsing · confidence scoring' },
        { name: 'Validation', detail: 'normalise and match against the reference knowledge base' },
        { name: 'LLM layer', detail: 'provider factory behind a responsible-AI safety checker' },
        { name: 'Insights & chat', detail: 'trends, forecasts and Qdrant-backed retrieval' },
      ],
    },
    links: [{ label: 'GitHub', href: 'https://github.com/KavinuS/MediInsight-Ai' }],
    image: '/projects/mediinsight.svg',
    imageSize: { width: 1600, height: 1000 },
    featured: true,
  },
  {
    slug: 'ai-code-reviewer',
    index: '03',
    title: 'AI Code Reviewer',
    category: 'Full-Stack · Developer Tooling',
    summary:
      'A code review platform that scores submissions against a structured marking scheme instead of returning a wall of model prose.',
    overview:
      'An AI-assisted review tool built as a Django REST backend with an Angular front end. Source code is analysed for bugs, security issues and quality problems, and the result comes back as a scored breakdown against an explicit evaluation scheme rather than as free-form model output.',
    problem:
      'Raw LLM code review is unstructured and hard to compare between runs. The backend separates the AI provider from the review pipeline and from a deterministic evaluation service, so reviews produce comparable category scores and a history worth keeping.',
    highlights: [
      'A layered Django backend that keeps the domain, the review pipeline, the repository and the AI provider in separate modules, with prompts held apart from the service that uses them.',
      'A dedicated evaluation service and marking scheme turn model output into scored categories, so two reviews of the same code can actually be compared.',
      'OAuth sign-in with GitHub and Google, built on a provider registry with CSRF state handling alongside token-based auth.',
      'Persisted review history with its own API, so past runs stay inspectable.',
      'Covered by a real test suite across auth, OAuth, the review API, the review pipeline, history and the evaluation service, with CI on GitHub Actions.',
      'An Angular front end organised by feature — review, history, dashboard, auth — over a shared core layer of API client, HTTP interceptors and route guards.',
    ],
    primaryStack: ['Django REST', 'Angular', 'PostgreSQL', 'OAuth 2.0'],
    stack: [
      'Python',
      'Django',
      'Django REST Framework',
      'PostgreSQL',
      'JWT',
      'OAuth 2.0',
      'Angular',
      'TypeScript',
      'GitHub Actions',
    ],
    links: [
      { label: 'Live demo', href: 'https://ai-code-reviewer-fe-six.vercel.app' },
      { label: 'Backend', href: 'https://github.com/KavinuS/Ai-Code-Reviewer-Be' },
      { label: 'Frontend', href: 'https://github.com/KavinuS/Ai-Code-Reviewer-Fe' },
    ],
    image: '/projects/ai-code-reviewer.jpg',
    imageSize: { width: 1427, height: 734 },
    featured: true,
  },
  {
    slug: 'biofusion',
    index: '04',
    title: 'BioFusion',
    category: 'Machine Learning · Medical Imaging',
    summary:
      'Vision Transformers and CNN ensembles classifying gastric cancer histopathology tissue across eight classes.',
    overview:
      'A deep learning project for classifying gastric cancer histopathology tissue images across eight tissue classes — from adipose and lymphocytes through stroma and tumour. Built for the BioFusion 2026 competition, where it placed 1st Runner-Up.',
    problem:
      'Histopathology slides carry heavy stain variation between labs and a strongly imbalanced class distribution, and the confusions that matter clinically are not the most common ones. The training setup targets exactly those failure modes.',
    highlights: [
      'Macenko stain normalisation for H&E images, so the model learns tissue structure rather than the staining protocol of a particular lab.',
      'Weighted focal loss with class-specific weighting that penalises the confusion pairs that matter most, addressing both class imbalance and hard examples.',
      'Two-phase training: classifier head training followed by full fine-tuning.',
      'Five architectures implemented and compared — ViT-Base, ResNet50, DenseNet121, EfficientNet-B4 and the histopathology-specific CTransPath — plus hybrid ensembles.',
      'A shared training harness and utilities across every model variant, with recorded training history and a written model comparison analysis.',
    ],
    primaryStack: ['PyTorch', 'Vision Transformers', 'timm', 'Python'],
    stack: [
      'Python',
      'PyTorch',
      'timm',
      'transformers',
      'torchstain',
      'scikit-learn',
      'Jupyter',
      'Google Colab',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/KavinuS/BioFusion' }],
    image: '/projects/biofusion.svg',
    imageSize: { width: 1600, height: 1000 },
    featured: true,
  },
  {
    slug: 'auditra',
    index: '05',
    title: 'Auditra',
    category: 'Team Project · Real-Time Web',
    summary: 'An auditing and valuation ERP built as a second-year university team project.',
    overview:
      'A team-built ERP for auditing and valuation workflows. My contribution centred on the onboarding flows and on the real-time layer that keeps collaborators in sync.',
    highlights: [
      'Built the client onboarding and employee onboarding flows, including the forms and their validation.',
      'Implemented the real-time communication layer over WebSockets.',
      'Added chat with mentions, and invitation tracking across the onboarding flow.',
      'Wired push notifications through Firebase Cloud Messaging.',
    ],
    primaryStack: ['WebSockets', 'Firebase Cloud Messaging'],
    stack: ['WebSockets', 'Firebase Cloud Messaging', 'REST APIs'],
    links: [],
    image: '/projects/auditra.svg',
    imageSize: { width: 1600, height: 1000 },
    featured: false,
    note: 'Team project — the repository is not public, so this entry lists only my own contributions.',
  },
  {
    slug: 'gold-victoria',
    index: '06',
    title: 'Gold Victoria',
    category: 'Backend · REST API',
    summary: 'A Spring Boot event and hall reservation backend with a strictly layered architecture.',
    overview:
      'An event reservation backend built on Spring Boot and Spring Data JPA, modelling users, events, categories, halls and reservations, and exposing them through a REST API.',
    highlights: [
      'A relational model covering users, events, categories, halls and reservations, mapped with Spring Data JPA.',
      'Strict layering throughout — controller, service interface, service implementation, repository — with request and response DTOs per resource rather than exposing entities directly.',
      'Availability checking for events, and batch reservation creation.',
      'Bean validation on incoming payloads, ModelMapper for entity/DTO mapping, and Lombok to keep the domain classes readable.',
    ],
    primaryStack: ['Java', 'Spring Boot', 'Spring Data JPA', 'MySQL'],
    stack: [
      'Java 21',
      'Spring Boot',
      'Spring Data JPA',
      'Spring Validation',
      'MySQL',
      'Lombok',
      'ModelMapper',
      'Maven',
    ],
    links: [{ label: 'Backend', href: 'https://github.com/KavinuS/Gold-Victoria-Client-final--BE' }],
    image: '/projects/gold-victoria.svg',
    imageSize: { width: 1600, height: 1000 },
    featured: false,
  },
]

export const featuredProjects = projects.filter((project) => project.featured)

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
