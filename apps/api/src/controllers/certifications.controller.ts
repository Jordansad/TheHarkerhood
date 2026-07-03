import type { Response } from 'express'
import { z } from 'zod'
import * as certificationsService from '../services/certifications.service'
import type { AuthedRequest } from '../middleware/auth'
import { BadRequestError } from '../lib/errors'

const statusSchema = z.object({ status: z.enum(['planned', 'studying', 'passed']) })

export async function list(req: AuthedRequest, res: Response) {
  const certifications = await certificationsService.listCertifications(req.userId!)
  res.json({ certifications })
}

export async function updateStatus(req: AuthedRequest, res: Response) {
  const parsed = statusSchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError('Statut invalide.')

  const certifications = await certificationsService.setCertificationStatus(req.userId!, req.params.id, parsed.data.status)
  res.json({ certifications })
}
