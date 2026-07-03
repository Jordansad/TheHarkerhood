import { prisma } from '../lib/prisma'
import { computeTier } from '../lib/xp'
import type { AdminOverviewDTO, AdminMemberStatusDTO, ProgressionTier } from '@hackerhood/types'

const TIER_ORDER: { tier: ProgressionTier; label: string }[] = [
  { tier: 'bronze', label: 'Bronze' },
  { tier: 'silver', label: 'Silver' },
  { tier: 'gold', label: 'Gold' },
  { tier: 'platinum', label: 'Platinum' },
  { tier: 'diamond', label: 'Diamond' },
  { tier: 'elite', label: 'Elite' },
  { tier: 'master', label: 'Master' },
  { tier: 'legend', label: 'Legend' },
]

const INACTIVE_THRESHOLD_DAYS = 14

function toMemberStatus(
  user: { id: string; displayName: string; role: AdminMemberStatusDTO['role']; xp: number; createdAt: Date },
  lastActivityAt: Date | null
): AdminMemberStatusDTO {
  const { tier, label } = computeTier(user.xp)
  const reference = lastActivityAt ?? user.createdAt
  const daysSinceActivity = Math.floor((Date.now() - reference.getTime()) / (1000 * 60 * 60 * 24))
  return {
    id: user.id,
    displayName: user.displayName,
    role: user.role,
    tier,
    tierLabel: label,
    xp: user.xp,
    lastActivityAt: lastActivityAt ? lastActivityAt.toISOString() : null,
    daysSinceActivity,
  }
}

export async function getOverview(): Promise<AdminOverviewDTO> {
  const users = await prisma.user.findMany({
    select: { id: true, displayName: true, role: true, xp: true, createdAt: true },
  })

  const lastEvents = await prisma.xpEvent.groupBy({ by: ['userId'], _max: { createdAt: true } })
  const lastActivityByUser = new Map(lastEvents.map((e) => [e.userId, e._max.createdAt]))

  const statuses = users.map((u) => toMemberStatus(u, lastActivityByUser.get(u.id) ?? null))

  const tierBreakdown = TIER_ORDER.map(({ tier, label }) => ({
    tier,
    label,
    count: statuses.filter((s) => s.tier === tier).length,
  }))

  const topMembers = [...statuses].sort((a, b) => b.xp - a.xp).slice(0, 5)

  const inactiveMembers = statuses
    .filter((s) => (s.daysSinceActivity ?? 0) >= INACTIVE_THRESHOLD_DAYS)
    .sort((a, b) => (b.daysSinceActivity ?? 0) - (a.daysSinceActivity ?? 0))
    .slice(0, 10)

  const recentLogs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { user: { select: { displayName: true } } },
  })
  const recentActivity = recentLogs.map((l) => ({
    id: l.id,
    displayName: l.user.displayName,
    type: l.type,
    points: l.points,
    createdAt: l.createdAt.toISOString(),
  }))

  return {
    totalMembers: users.length,
    tierBreakdown,
    topMembers,
    inactiveMembers,
    recentActivity,
  }
}
