import type { ProgressionTier } from '@hackerhood/types'

export const TIER_MIN: Record<ProgressionTier, number> = {
  bronze: 0,
  silver: 101,
  gold: 301,
  platinum: 601,
  diamond: 1001,
  elite: 1501,
  master: 2001,
  legend: 3000,
}

const TIER_ORDER: ProgressionTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'elite', 'master', 'legend']

export const TIER_COLOR: Record<ProgressionTier, string> = {
  bronze: 'text-[#cd7f32]',
  silver: 'text-[#c0c0c0]',
  gold: 'text-[#ffd700]',
  platinum: 'text-[#a1e3ff]',
  diamond: 'text-[#63d9ff]',
  elite: 'text-expert',
  master: 'text-danger',
  legend: 'text-accent',
}

export function tierProgressPercent(xp: number, tier: ProgressionTier): number {
  const idx = TIER_ORDER.indexOf(tier)
  const min = TIER_MIN[tier]
  const nextTier = TIER_ORDER[idx + 1]
  if (!nextTier) return 100
  const max = TIER_MIN[nextTier]
  return Math.round(((xp - min) / (max - min)) * 100)
}
