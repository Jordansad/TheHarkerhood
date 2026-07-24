import { prisma } from '../lib/prisma'
import { computeTier } from '../lib/xp'
import { NotFoundError, BadRequestError } from '../lib/errors'
import { PHASE_LABEL, PHASE_ORDER } from '../lib/phase'
import type {
  AdminOverviewDTO,
  AdminMemberStatusDTO,
  AdminMemberListItemDTO,
  AdminMemberDetailDTO,
  MemberFollowUpStatus,
  ProgressionTier,
} from '@hackerhood/types'

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
const AT_RISK_THRESHOLD_DAYS = 7

function toFollowUpStatus(daysSinceActivity: number | null): MemberFollowUpStatus {
  if (daysSinceActivity === null) return 'inactive'
  if (daysSinceActivity >= INACTIVE_THRESHOLD_DAYS) return 'inactive'
  if (daysSinceActivity >= AT_RISK_THRESHOLD_DAYS) return 'at_risk'
  return 'on_track'
}

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

export async function getMembers(): Promise<AdminMemberListItemDTO[]> {
  const [users, lastEvents, skills, progressRows] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, displayName: true, role: true, xp: true, createdAt: true },
      orderBy: { displayName: 'asc' },
    }),
    prisma.xpEvent.groupBy({ by: ['userId'], _max: { createdAt: true } }),
    prisma.skill.findMany({ select: { id: true, phase: true } }),
    prisma.userSkillProgress.findMany({ select: { userId: true, skillId: true, status: true } }),
  ])

  const lastActivityByUser = new Map(lastEvents.map((e) => [e.userId, e._max.createdAt]))
  const progressByUser = new Map<string, typeof progressRows>()
  for (const row of progressRows) {
    const list = progressByUser.get(row.userId) ?? []
    list.push(row)
    progressByUser.set(row.userId, list)
  }

  const skillIdsByPhase = PHASE_ORDER.map((phase) => skills.filter((s) => s.phase === phase).map((s) => s.id))
  const totalSkills = skills.length

  return users.map((u) => {
    const { tier, label } = computeTier(u.xp)
    const lastActivityAt = lastActivityByUser.get(u.id) ?? null
    const reference = lastActivityAt ?? u.createdAt
    const daysSinceActivity = Math.floor((Date.now() - reference.getTime()) / (1000 * 60 * 60 * 24))

    const userProgress = progressByUser.get(u.id) ?? []
    const completedIds = new Set(userProgress.filter((p) => p.status === 'completed').map((p) => p.skillId))
    const completedSkills = completedIds.size
    const progressPercent = totalSkills === 0 ? 0 : Math.round((completedSkills / totalSkills) * 100)

    const currentPhaseIndex = skillIdsByPhase.findIndex(
      (ids) => ids.length > 0 && ids.some((id) => !completedIds.has(id))
    )
    const currentPhase = currentPhaseIndex === -1 ? null : PHASE_ORDER[currentPhaseIndex]

    return {
      id: u.id,
      displayName: u.displayName,
      role: u.role,
      tier,
      tierLabel: label,
      xp: u.xp,
      currentPhase,
      completedSkills,
      totalSkills,
      progressPercent,
      lastActivityAt: lastActivityAt ? lastActivityAt.toISOString() : null,
      daysSinceActivity,
      followUpStatus: toFollowUpStatus(daysSinceActivity),
    }
  })
}

export async function getMemberDetail(userId: string): Promise<AdminMemberDetailDTO> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, displayName: true, email: true, role: true, xp: true, streakCount: true, createdAt: true },
  })
  if (!user) throw new NotFoundError('Membre introuvable.')

  const [skills, progressRows, lastActivity, badgeRows, recentLogs] = await Promise.all([
    prisma.skill.findMany({ select: { id: true, phase: true } }),
    prisma.userSkillProgress.findMany({ where: { userId }, select: { skillId: true, status: true } }),
    prisma.xpEvent.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' }, select: { createdAt: true } }),
    prisma.userBadge.findMany({ where: { userId }, include: { badge: true }, orderBy: { earnedAt: 'desc' } }),
    prisma.activityLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 10 }),
  ])

  const statusBySkillId = new Map(progressRows.map((p) => [p.skillId, p.status]))
  const completedIds = new Set(progressRows.filter((p) => p.status === 'completed').map((p) => p.skillId))

  const phaseProgress = PHASE_ORDER.map((phase) => {
    const phaseSkills = skills.filter((s) => s.phase === phase)
    const total = phaseSkills.length
    const completed = phaseSkills.filter((s) => completedIds.has(s.id)).length
    const inProgress = phaseSkills.filter((s) => statusBySkillId.get(s.id) === 'in_progress').length
    return {
      phase,
      label: PHASE_LABEL[phase],
      total,
      completed,
      inProgress,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    }
  })

  const totalSkills = skills.length
  const completedSkills = completedIds.size
  const lastActivityAt = lastActivity?.createdAt ?? null
  const reference = lastActivityAt ?? user.createdAt
  const daysSinceActivity = Math.floor((Date.now() - reference.getTime()) / (1000 * 60 * 60 * 24))

  const { tier, label, xpToNextTier } = computeTier(user.xp)

  return {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    role: user.role,
    tier,
    tierLabel: label,
    xp: user.xp,
    xpToNextTier,
    streakCount: user.streakCount,
    createdAt: user.createdAt.toISOString(),
    lastActivityAt: lastActivityAt ? lastActivityAt.toISOString() : null,
    daysSinceActivity,
    followUpStatus: toFollowUpStatus(daysSinceActivity),
    completedSkills,
    totalSkills,
    progressPercent: totalSkills === 0 ? 0 : Math.round((completedSkills / totalSkills) * 100),
    phaseProgress,
    badges: badgeRows.map((b) => ({
      slug: b.badge.slug,
      title: b.badge.title,
      icon: b.badge.icon,
      earnedAt: b.earnedAt.toISOString(),
    })),
    recentActivity: recentLogs.map((l) => ({
      id: l.id,
      displayName: user.displayName,
      type: l.type,
      points: l.points,
      createdAt: l.createdAt.toISOString(),
    })),
  }
}

export async function deleteMember(requesterId: string, targetId: string): Promise<void> {
  if (requesterId === targetId) {
    throw new BadRequestError('Vous ne pouvez pas supprimer votre propre compte.')
  }

  const target = await prisma.user.findUnique({ where: { id: targetId }, select: { id: true } })
  if (!target) throw new NotFoundError('Membre introuvable.')

  await prisma.user.delete({ where: { id: targetId } })
}
