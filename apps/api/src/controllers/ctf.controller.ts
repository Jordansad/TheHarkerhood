import type { Response } from 'express'
import * as ctfService from '../services/ctf.service'
import type { AuthedRequest } from '../middleware/auth'

export async function listCategories(_req: AuthedRequest, res: Response) {
  const categories = await ctfService.listCategories()
  res.json({ categories })
}

export async function getCategoryBySlug(req: AuthedRequest, res: Response) {
  const category = await ctfService.getCategoryBySlug(req.params.slug)
  res.json({ category })
}

export async function listCompetitions(_req: AuthedRequest, res: Response) {
  const competitions = await ctfService.listCompetitions()
  res.json({ competitions })
}
