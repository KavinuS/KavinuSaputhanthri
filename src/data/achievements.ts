/** Placement tiers drive the visual weight each row gets. */
export type Placement = 'champion' | 'runner-up' | 'finalist'

export type Achievement = {
  year: string
  placement: string
  tier: Placement
  event: string
  organiser: string
}

export const achievements: Achievement[] = [
  {
    year: '2026',
    placement: 'Champion',
    tier: 'champion',
    event: 'AI Code Challenge',
    organiser: 'IEEE Society, KDU',
  },
  {
    year: '2025',
    placement: 'Champion',
    tier: 'champion',
    event: 'InnovoTex',
    organiser: 'Zeebra Technologies',
  },
  {
    year: '2026',
    placement: '1st Runner-Up',
    tier: 'runner-up',
    event: 'BioFusion',
    organiser: 'University of Sri Jayewardenepura',
  },
  {
    year: '2026',
    placement: '2nd Runner-Up',
    tier: 'runner-up',
    event: 'Algo Arena',
    organiser: 'Leo Club of University of Sri Jayewardenepura',
  },
  {
    year: '2026',
    placement: 'Finalist',
    tier: 'finalist',
    event: 'GenZipher CTF',
    organiser: 'University of Colombo School of Computing',
  },
  {
    year: '2026',
    placement: 'Finalist',
    tier: 'finalist',
    event: 'Agentrix',
    organiser: 'Faculty of Engineering, University of Ruhuna',
  },
  {
    year: '2026',
    placement: 'Finalist',
    tier: 'finalist',
    event: 'NeuroX 3.0',
    organiser: 'Hackathon Hub, NSBM Green University',
  },
]
