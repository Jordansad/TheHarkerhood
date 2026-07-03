import { Router } from 'express'
import * as quizController from '../controllers/quiz.controller'
import { requireAuth, requireQuizManager } from '../middleware/auth'
import { asyncHandler } from '../lib/async-handler'

export const quizRouter = Router()

quizRouter.use(requireAuth)
quizRouter.get('/', asyncHandler(quizController.list))
quizRouter.post('/', requireQuizManager, asyncHandler(quizController.create))
quizRouter.get('/:id', asyncHandler(quizController.getById))
quizRouter.get('/:id/edit', requireQuizManager, asyncHandler(quizController.getForEditing))
quizRouter.put('/:id', requireQuizManager, asyncHandler(quizController.update))
quizRouter.delete('/:id', requireQuizManager, asyncHandler(quizController.remove))
quizRouter.post('/:id/submit', asyncHandler(quizController.submit))
