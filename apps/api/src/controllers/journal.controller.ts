import type { Response } from 'express'
import { z } from 'zod'
import * as journalService from '../services/journal.service'
import type { AuthedRequest } from '../middleware/auth'
import { BadRequestError } from '../lib/errors'

const JOURNAL_TYPES = ['note', 'writeup', 'pentest_report', 'incident_report', 'daily'] as const

const createSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string(),
  type: z.enum(JOURNAL_TYPES),
  tags: z.array(z.string()).default([]),
})

const updateSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string(),
  tags: z.array(z.string()).default([]),
})

export async function list(req: AuthedRequest, res: Response) {
  const entries = await journalService.listEntries(req.userId!)
  res.json({ entries })
}

export async function getById(req: AuthedRequest, res: Response) {
  const entry = await journalService.getEntry(req.userId!, req.params.id)
  res.json({ entry })
}

export async function create(req: AuthedRequest, res: Response) {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError("Entrée invalide.")

  const entry = await journalService.createEntry(req.userId!, parsed.data.title, parsed.data.content, parsed.data.type, parsed.data.tags)
  res.status(201).json({ entry })
}

export async function update(req: AuthedRequest, res: Response) {
  const parsed = updateSchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError("Entrée invalide.")

  const entry = await journalService.updateEntry(req.userId!, req.params.id, parsed.data.title, parsed.data.content, parsed.data.tags)
  res.json({ entry })
}

export async function remove(req: AuthedRequest, res: Response) {
  await journalService.deleteEntry(req.userId!, req.params.id)
  res.status(204).send()
}
