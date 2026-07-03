import { Router } from 'express'
import * as activitiesController from '../controllers/activities.controller'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../lib/async-handler'

export const activitiesRouter = Router()

activitiesRouter.use(requireAuth)
activitiesRouter.get('/', asyncHandler(activitiesController.list))
activitiesRouter.post('/', asyncHandler(activitiesController.create))
