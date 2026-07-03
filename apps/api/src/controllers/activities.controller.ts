import type { Response } from 'express'
import { z } from 'zod'
import * as activitiesService from '../services/activities.service'
import type { AuthedRequest } from '../middleware/auth'
import { BadRequestError } from '../lib/errors'

const ACTIVITY_TYPES = [
  'thm_room', 'htb_easy', 'htb_medium', 'htb_hard', 'ctf_participation', 'ctf_flag',
  'writeup', 'script', 'pentest_report', 'mentoring', 'talk', 'external_cert',
] as const

const logSchema = z.object({
  type: z.enum(ACTIVITY_TYPES),
  note: z.string().max(500).optional(),
  points: z.number().int().optional(),
})

export async function list(req: AuthedRequest, res: Response) {
  const activities = await activitiesService.listActivities(req.userId!)
  res.json({ activities })
}

export async function create(req: AuthedRequest, res: Response) {
  const parsed = logSchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError("Activité invalide.")

  const activities = await activitiesService.logActivity(req.userId!, parsed.data.type, parsed.data.note, parsed.data.points)
  res.status(201).json({ activities })
}
