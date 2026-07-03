import { prisma } from '../lib/prisma'
import { computeLevel } from '../lib/xp'
import type { DashboardStatsDTO } from '@cyberpath/types'

export async function getDashboardStats(userId: string): Promise<DashboardStatsDTO> {
  const [user, skills, progressRows] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.skill.findMany({
      select: { id: true, slug: true, title: true, position: true, prerequisites: { select: { id: true } } },
      orderBy: { position: 'asc' },
    }),
    prisma.userSkillProgress.findMany({ where: { userId } }),
  ])

  const statusBySkillId = new Map(progressRows.map((p) => [p.skillId, p.status]))
  const completedIds = new Set(progressRows.filter((p) => p.status === 'completed').map((p) => p.skillId))

  const completedSkills = completedIds.size
  const inProgressSkills = progressRows.filter((p) => p.status === 'in_progress').length
  const totalSkills = skills.length

  const nextSkill = skills.find((skill) => {
    if (statusBySkillId.get(skill.id) === 'completed') return false
    return skill.prerequisites.every((prereq) => completedIds.has(prereq.id))
  })

  const { level, xpToNextLevel } = computeLevel(user.xp)

  return {
    totalSkills,
    completedSkills,
    inProgressSkills,
    progressPercent: totalSkills === 0 ? 0 : Math.round((completedSkills / totalSkills) * 100),
    xp: user.xp,
    level,
    xpToNextLevel,
    streakCount: user.streakCount,
    nextSuggestedSkill: nextSkill ? { id: nextSkill.id, slug: nextSkill.slug, title: nextSkill.title } : null,
  }
}
