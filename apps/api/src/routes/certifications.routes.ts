import { Router } from 'express'
import * as certificationsController from '../controllers/certifications.controller'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../lib/async-handler'

export const certificationsRouter = Router()

certificationsRouter.use(requireAuth)
certificationsRouter.get('/', asyncHandler(certificationsController.list))
certificationsRouter.patch('/:id/status', asyncHandler(certificationsController.updateStatus))
