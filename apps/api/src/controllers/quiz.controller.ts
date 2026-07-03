import type { Response } from 'express'
import { z } from 'zod'
import * as quizService from '../services/quiz.service'
import type { AuthedRequest } from '../middleware/auth'
import { BadRequestError } from '../lib/errors'

const submitSchema = z.object({ answers: z.record(z.string(), z.number()) })

const SKILL_CATEGORIES = [
  'linux', 'networking', 'web', 'active_directory', 'windows', 'privesc', 'api_security', 'cloud',
  'reverse_engineering', 'malware_analysis', 'forensics', 'red_team', 'scripting', 'osint', 'blue_team',
  'bug_bounty', 'containers', 'ai_security', 'exploitation',
] as const

const questionSchema = z.object({
  prompt: z.string().min(1),
  choices: z.array(z.string().min(1)).min(2).max(6),
  correctIndex: z.number().int().min(0),
  explanation: z.string().min(1),
})

const quizSchema = z.object({
  title: z.string().min(1).max(150),
  category: z.enum(SKILL_CATEGORIES),
  questions: z.array(questionSchema).min(1),
})

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

export async function getForEditing(req: AuthedRequest, res: Response) {
  const quiz = await quizService.getQuizForEditing(req.params.id)
  res.json({ quiz })
}

export async function create(req: AuthedRequest, res: Response) {
  const parsed = quizSchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError(parsed.error.issues[0]?.message ?? 'Quiz invalide.')

  const quiz = await quizService.createQuiz(parsed.data.title, parsed.data.category, parsed.data.questions)
  res.status(201).json({ quiz })
}

export async function update(req: AuthedRequest, res: Response) {
  const parsed = quizSchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError(parsed.error.issues[0]?.message ?? 'Quiz invalide.')

  const quiz = await quizService.updateQuiz(req.params.id, parsed.data.title, parsed.data.category, parsed.data.questions)
  res.json({ quiz })
}

export async function remove(req: AuthedRequest, res: Response) {
  await quizService.deleteQuiz(req.params.id)
  res.status(204).send()
}
