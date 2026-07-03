import { Router } from 'express'
import * as journalController from '../controllers/journal.controller'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../lib/async-handler'

export const journalRouter = Router()

journalRouter.use(requireAuth)
journalRouter.get('/', asyncHandler(journalController.list))
journalRouter.get('/:id', asyncHandler(journalController.getById))
journalRouter.post('/', asyncHandler(journalController.create))
journalRouter.put('/:id', asyncHandler(journalController.update))
journalRouter.delete('/:id', asyncHandler(journalController.remove))
