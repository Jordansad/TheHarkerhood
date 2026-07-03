import type { Response } from 'express'
import { z } from 'zod'
import * as methodologiesService from '../services/methodologies.service'
import type { AuthedRequest } from '../middleware/auth'
import { BadRequestError } from '../lib/errors'

const stepSchema = z.object({ checked: z.boolean() })

export async function list(req: AuthedRequest, res: Response) {
  const methodologies = await methodologiesService.listMethodologies(req.userId!)
  res.json({ methodologies })
}

export async function getBySlug(req: AuthedRequest, res: Response) {
  const methodology = await methodologiesService.getMethodologyBySlug(req.userId!, req.params.slug)
  res.json({ methodology })
}

export async function updateStep(req: AuthedRequest, res: Response) {
  const parsed = stepSchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError('Valeur "checked" invalide.')

  await methodologiesService.setStepChecked(req.userId!, req.params.stepId, parsed.data.checked)
  const methodology = await methodologiesService.getMethodologyBySlug(req.userId!, req.params.slug)
  res.json({ methodology })
}
