export type EducationEntry = {
  institution: string
  qualification: string
  period: string
  /** Label/value pairs rendered as a small definition grid. */
  facts?: { label: string; value: string }[]
  faculty?: string
}

export const education: EducationEntry[] = [
  {
    institution: 'University of Moratuwa',
    faculty: 'Faculty of Information Technology',
    qualification: 'BSc (Hons) in Information Technology',
    period: 'Third Year',
    facts: [{ label: 'CGPA', value: '3.41 / 4.00' }],
  },
  {
    institution: 'ICET Sri Lanka',
    qualification: 'Diploma in Information Technology',
    period: '2025',
  },
  {
    institution: 'Royal College Colombo 07',
    qualification: 'Grade 1 — Grade 13',
    period: '2008 — 2021/2022',
    facts: [
      { label: 'G.C.E. Advanced Level', value: 'Physics A · Chemistry B · Biology B' },
      { label: 'Z-Score', value: '1.7958' },
      { label: 'G.C.E. Ordinary Level', value: '9A' },
    ],
  },
]
