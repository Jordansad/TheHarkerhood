import { Router } from 'express'
import * as skillsController from '../controllers/skills.controller'
import { requireAuth, requireQuizManager } from '../middleware/auth'
import { asyncHandler } from '../lib/async-handler'

export const skillsRouter = Router()

skillsRouter.use(requireAuth)
skillsRouter.get('/', asyncHandler(skillsController.list))
skillsRouter.get('/:slug', asyncHandler(skillsController.getBySlug))
skillsRouter.patch('/:slug/progress', asyncHandler(skillsController.updateProgress))
skillsRouter.get('/:slug/theory-edit', requireQuizManager, asyncHandler(skillsController.getTheoryForEdit))
skillsRouter.put('/:slug/theory', requireQuizManager, asyncHandler(skillsController.updateTheory))
