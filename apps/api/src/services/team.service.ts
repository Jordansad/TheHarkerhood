import { prisma } from '../lib/prisma'
import { computeTier } from '../lib/xp'
import type { TeamMemberDTO } from '@hackerhood/types'

export async function listTeamMembers(): Promise<TeamMemberDTO[]> {
  const users = await prisma.user.findMany({
    select: { id: true, displayName: true, role: true, xp: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  return users.map((u) => {
    const { tier, label } = computeTier(u.xp)
    return { id: u.id, displayName: u.displayName, role: u.role, tier, tierLabel: label, createdAt: u.createdAt.toISOString() }
  })
}
