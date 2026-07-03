import { Router } from 'express'
import * as quizController from '../controllers/quiz.controller'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../lib/async-handler'

export const quizRouter = Router()

quizRouter.use(requireAuth)
quizRouter.get('/', asyncHandler(quizController.list))
quizRouter.get('/:id', asyncHandler(quizController.getById))
quizRouter.post('/:id/submit', asyncHandler(quizController.submit))
