import { Router } from 'express'
import * as teamController from '../controllers/team.controller'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../lib/async-handler'

export const teamRouter = Router()

teamRouter.use(requireAuth)
teamRouter.get('/', asyncHandler(teamController.list))
