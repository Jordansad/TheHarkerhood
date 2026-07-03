import { Router } from 'express'
import * as mentorController from '../controllers/mentor.controller'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../lib/async-handler'

export const mentorRouter = Router()

mentorRouter.use(requireAuth)
mentorRouter.get('/conversations', asyncHandler(mentorController.listConversations))
mentorRouter.get('/conversations/:id', asyncHandler(mentorController.getConversation))
mentorRouter.post('/messages', asyncHandler(mentorController.sendMessage))
