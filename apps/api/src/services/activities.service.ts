import { prisma } from '../lib/prisma'
import { awardXp } from './xp.service'
import { BadRequestError } from '../lib/errors'
import type { ActivityLogDTO, ActivityType } from '@hackerhood/types'

const FIXED_POINTS: Partial<Record<ActivityType, number>> = {
  thm_room: 5,
  htb_easy: 10,
  htb_medium: 20,
  htb_hard: 35,
  ctf_participation: 5,
  writeup: 10,
  script: 15,
  pentest_report: 25,
  mentoring: 20,
  talk: 30,
  external_cert: 50,
}

const ACTIVITY_LABEL: Record<ActivityType, string> = {
  thm_room: 'Room TryHackMe',
  htb_easy: 'Machine HTB Easy',
  htb_medium: 'Machine HTB Medium',
  htb_hard: 'Machine HTB Hard',
  ctf_participation: 'Participation CTF',
  ctf_flag: 'Flag CTF résolu',
  writeup: 'Write-up publié',
  script: 'Script/outil développé',
  pentest_report: 'Rapport de pentest',
  mentoring: "Mentorat d'un membre",
  talk: 'Talk/présentation',
  external_cert: 'Certification externe',
}

/** Calcule les points selon le barème du manuel ; ctf_flag est variable (3 à 15 points, fourni par le client). */
function resolvePoints(type: ActivityType, requestedPoints?: number): number {
  if (type === 'ctf_flag') {
    if (!requestedPoints || requestedPoints < 3 || requestedPoints > 15) {
      throw new BadRequestError('Un flag CTF vaut entre 3 et 15 points.')
    }
    return requestedPoints
  }
  return FIXED_POINTS[type] ?? 0
}

export async function listActivities(userId: string): Promise<ActivityLogDTO[]> {
  const logs = await prisma.activityLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 100 })
  return logs.map((l) => ({ id: l.id, type: l.type, points: l.points, note: l.note, createdAt: l.createdAt.toISOString() }))
}

export async function logActivity(userId: string, type: ActivityType, note: string | undefined, requestedPoints?: number) {
  const points = resolvePoints(type, requestedPoints)

  await prisma.activityLog.create({ data: { userId, type, points, note } })
  await awardXp(userId, points, ACTIVITY_LABEL[type])

  return listActivities(userId)
}
