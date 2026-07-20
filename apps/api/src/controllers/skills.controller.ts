import type { Response } from 'express'
import { z } from 'zod'
import * as skillsService from '../services/skills.service'
import type { AuthedRequest } from '../middleware/auth'
import { BadRequestError } from '../lib/errors'

const progressSchema = z.object({
  status: z.enum(['not_started', 'in_progress', 'completed']),
})

const theorySchema = z.object({
  theoryContent: z.string(),
  theoryPublished: z.boolean(),
})

export async function list(req: AuthedRequest, res: Response) {
  const skills = await skillsService.listSkills(req.userId!)
  res.json({ skills })
}

export async function getBySlug(req: AuthedRequest, res: Response) {
  const skill = await skillsService.getSkillBySlug(req.userId!, req.params.slug)
  res.json({ skill })
}

export async function updateProgress(req: AuthedRequest, res: Response) {
  const parsed = progressSchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError('Statut de progression invalide.')

  const skill = await skillsService.setSkillProgress(req.userId!, req.params.slug, parsed.data.status)
  res.json({ skill })
}

export async function getTheoryForEdit(req: AuthedRequest, res: Response) {
  const skill = await skillsService.getSkillTheoryForEdit(req.params.slug)
  res.json({ skill })
}

export async function updateTheory(req: AuthedRequest, res: Response) {
  const parsed = theorySchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError('Contenu de cours invalide.')

  const skill = await skillsService.updateSkillTheory(req.params.slug, parsed.data.theoryContent, parsed.data.theoryPublished)
  res.json({ skill })
}
