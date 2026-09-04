export type SkillGroup = {
  title: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Languages',
    items: ['Java', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'Dart'],
  },
  {
    title: 'Backend & Systems',
    items: [
      'Spring Boot',
      'Django',
      'Django REST Framework',
      'FastAPI',
      'REST APIs',
      'Microservices',
      'Message Queues',
      'WebSockets',
      'Distributed Systems',
      'JWT',
      'RBAC',
    ],
  },
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'Angular', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: 'Data',
    items: ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Redis', 'Qdrant'],
  },
  {
    title: 'AI & Machine Learning',
    items: [
      'Machine Learning',
      'LLM Applications',
      'Generative AI',
      'NLP',
      'OCR',
      'spaCy',
      'Tesseract',
      'Information Extraction',
      'PyTorch',
    ],
  },
  {
    title: 'Tools & Infrastructure',
    items: ['Git', 'GitHub', 'Docker', 'GitHub Actions', 'Postman', 'Celery', 'MinIO', 'VS Code'],
  },
]
