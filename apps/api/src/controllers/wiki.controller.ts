import type { Response } from 'express'
import { z } from 'zod'
import * as wikiService from '../services/wiki.service'
import type { AuthedRequest } from '../middleware/auth'
import { BadRequestError } from '../lib/errors'

const pageSchema = z.object({
  title: z.string().min(1).max(200),
  category: z.string().min(1).max(80),
  content: z.string(),
})

export async function list(_req: AuthedRequest, res: Response) {
  const pages = await wikiService.listPages()
  res.json({ pages })
}

export async function getBySlug(req: AuthedRequest, res: Response) {
  const page = await wikiService.getPageBySlug(req.params.slug)
  res.json({ page })
}

export async function create(req: AuthedRequest, res: Response) {
  const parsed = pageSchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError('Page invalide.')

  const page = await wikiService.createPage(parsed.data.title, parsed.data.category, parsed.data.content)
  res.status(201).json({ page })
}

export async function update(req: AuthedRequest, res: Response) {
  const parsed = pageSchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError('Page invalide.')

  const page = await wikiService.updatePage(req.params.slug, parsed.data.title, parsed.data.category, parsed.data.content)
  res.json({ page })
}

export async function remove(req: AuthedRequest, res: Response) {
  await wikiService.deletePage(req.params.slug)
  res.status(204).send()
}
