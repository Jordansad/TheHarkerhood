import { Router } from 'express'
import * as methodologiesController from '../controllers/methodologies.controller'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../lib/async-handler'

export const methodologiesRouter = Router()

methodologiesRouter.use(requireAuth)
methodologiesRouter.get('/', asyncHandler(methodologiesController.list))
methodologiesRouter.get('/:slug', asyncHandler(methodologiesController.getBySlug))
methodologiesRouter.patch('/:slug/steps/:stepId', asyncHandler(methodologiesController.updateStep))
