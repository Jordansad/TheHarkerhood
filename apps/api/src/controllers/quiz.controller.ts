import type { Response } from 'express'
import { z } from 'zod'
import * as quizService from '../services/quiz.service'
import type { AuthedRequest } from '../middleware/auth'
import { BadRequestError } from '../lib/errors'

const submitSchema = z.object({ answers: z.record(z.string(), z.number()) })

export async function list(_req: AuthedRequest, res: Response) {
  const quizzes = await quizService.listQuizzes()
  res.json({ quizzes })
}

export async function getById(req: AuthedRequest, res: Response) {
  const quiz = await quizService.getQuizForTaking(req.params.id)
  res.json({ quiz })
}

export async function submit(req: AuthedRequest, res: Response) {
  const parsed = submitSchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError('Réponses invalides.')

  const result = await quizService.submitQuiz(req.userId!, req.params.id, parsed.data.answers)
  res.json({ result })
}
