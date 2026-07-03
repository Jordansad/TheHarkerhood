import { Router } from 'express'
import * as adminController from '../controllers/admin.controller'
import { requireAuth, requireAdmin } from '../middleware/auth'
import { asyncHandler } from '../lib/async-handler'

export const adminRouter = Router()

adminRouter.use(requireAuth, requireAdmin)
adminRouter.get('/overview', asyncHandler(adminController.overview))
