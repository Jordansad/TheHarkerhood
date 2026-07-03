import type { ProgressionTier } from '@hackerhood/types'

const TIERS: { tier: ProgressionTier; label: string; min: number }[] = [
  { tier: 'bronze', label: 'Bronze', min: 0 },
  { tier: 'silver', label: 'Silver', min: 101 },
  { tier: 'gold', label: 'Gold', min: 301 },
  { tier: 'platinum', label: 'Platinum', min: 601 },
  { tier: 'diamond', label: 'Diamond', min: 1001 },
  { tier: 'elite', label: 'Elite', min: 1501 },
  { tier: 'master', label: 'Master', min: 2001 },
  { tier: 'legend', label: 'Legend', min: 3000 },
]

/** Paliers de progression Bronze → Legend (Manuel Officiel The Hackerhood, Chapitre 08). */
export function computeTier(xp: number): { tier: ProgressionTier; label: string; xpToNextTier: number } {
  let current = TIERS[0]
  for (const t of TIERS) {
    if (xp >= t.min) current = t
  }
  const next = TIERS[TIERS.indexOf(current) + 1]
  const xpToNextTier = next ? Math.max(0, next.min - xp) : 0
  return { tier: current.tier, label: current.label, xpToNextTier }
}
