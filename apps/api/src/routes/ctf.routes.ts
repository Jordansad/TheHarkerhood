import { Router } from 'express'
import * as ctfController from '../controllers/ctf.controller'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../lib/async-handler'

export const ctfRouter = Router()

ctfRouter.use(requireAuth)
ctfRouter.get('/categories', asyncHandler(ctfController.listCategories))
ctfRouter.get('/categories/:slug', asyncHandler(ctfController.getCategoryBySlug))
ctfRouter.get('/competitions', asyncHandler(ctfController.listCompetitions))
