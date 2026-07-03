import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../lib/async-handler'

export const authRouter = Router()

authRouter.post('/register', asyncHandler(authController.register))
authRouter.post('/login', asyncHandler(authController.login))
authRouter.post('/logout', asyncHandler(authController.logout))
authRouter.get('/me', requireAuth, asyncHandler(authController.me))
