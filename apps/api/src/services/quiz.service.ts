import { prisma } from '../lib/prisma'
import { NotFoundError, BadRequestError } from '../lib/errors'
import type { QuizDTO, QuizSubmitResultDTO } from '@hackerhood/types'
import type { SkillCategory } from '@prisma/client'

export async function listQuizzes() {
  const quizzes = await prisma.quiz.findMany({ include: { _count: { select: { questions: true } } } })
  return quizzes.map((q) => ({ id: q.id, title: q.title, category: q.category, questionCount: q._count.questions }))
}

export async function getQuizForTaking(id: string): Promise<QuizDTO> {
  const quiz = await prisma.quiz.findUnique({ where: { id }, include: { questions: true } })
  if (!quiz) throw new NotFoundError('Quiz introuvable.')

  return {
    id: quiz.id,
    title: quiz.title,
    category: quiz.category,
    questions: quiz.questions.map((q) => ({ id: q.id, prompt: q.prompt, choices: q.choices as string[] })),
  }
}

export async function submitQuiz(userId: string, quizId: string, answers: Record<string, number>): Promise<QuizSubmitResultDTO> {
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId }, include: { questions: true } })
  if (!quiz) throw new NotFoundError('Quiz introuvable.')
  if (quiz.questions.length === 0) throw new BadRequestError('Ce quiz ne contient aucune question.')

  const results = quiz.questions.map((q) => ({
    questionId: q.id,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    isCorrect: answers[q.id] === q.correctIndex,
  }))
  const score = results.filter((r) => r.isCorrect).length

  await prisma.userQuizAttempt.create({ data: { userId, quizId, score, total: quiz.questions.length } })

  return {
    score,
    total: quiz.questions.length,
    results: results.map(({ questionId, correctIndex, explanation }) => ({ questionId, correctIndex, explanation })),
  }
}

export interface QuestionInput {
  prompt: string
  choices: string[]
  correctIndex: number
  explanation: string
}

export async function getQuizForEditing(id: string) {
  const quiz = await prisma.quiz.findUnique({ where: { id }, include: { questions: true } })
  if (!quiz) throw new NotFoundError('Quiz introuvable.')
  return quiz
}

export async function createQuiz(title: string, category: SkillCategory, questions: QuestionInput[]) {
  const quiz = await prisma.quiz.create({
    data: {
      title,
      category,
      questions: { create: questions.map((q) => ({ ...q, choices: q.choices })) },
    },
    include: { questions: true },
  })
  return quiz
}

export async function updateQuiz(id: string, title: string, category: SkillCategory, questions: QuestionInput[]) {
  const existing = await prisma.quiz.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('Quiz introuvable.')

  await prisma.quizQuestion.deleteMany({ where: { quizId: id } })
  const quiz = await prisma.quiz.update({
    where: { id },
    data: {
      title,
      category,
      questions: { create: questions.map((q) => ({ ...q, choices: q.choices })) },
    },
    include: { questions: true },
  })
  return quiz
}

export async function deleteQuiz(id: string) {
  const existing = await prisma.quiz.findUnique({ where: { id } })
  if (!existing) throw new NotFoundError('Quiz introuvable.')
  await prisma.quiz.delete({ where: { id } })
}
