import type { Response } from 'express'
import { z } from 'zod'
import * as mentorService from '../services/mentor.service'
import type { AuthedRequest } from '../middleware/auth'
import { BadRequestError } from '../lib/errors'

const sendSchema = z.object({
  conversationId: z.string().optional(),
  content: z.string().min(1).max(4000),
})

export async function listConversations(req: AuthedRequest, res: Response) {
  const conversations = await mentorService.listConversations(req.userId!)
  res.json({ conversations })
}

export async function getConversation(req: AuthedRequest, res: Response) {
  const conversation = await mentorService.getConversation(req.userId!, req.params.id)
  res.json({ conversation })
}

export async function sendMessage(req: AuthedRequest, res: Response) {
  const parsed = sendSchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError('Message invalide.')

  const conversation = await mentorService.sendMessage(req.userId!, parsed.data.conversationId, parsed.data.content)
  res.json({ conversation })
}
