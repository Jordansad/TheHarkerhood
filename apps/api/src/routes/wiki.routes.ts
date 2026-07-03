import { Router } from 'express'
import * as wikiController from '../controllers/wiki.controller'
import { requireAuth } from '../middleware/auth'
import { asyncHandler } from '../lib/async-handler'

export const wikiRouter = Router()

wikiRouter.use(requireAuth)
wikiRouter.get('/', asyncHandler(wikiController.list))
wikiRouter.get('/:slug', asyncHandler(wikiController.getBySlug))
wikiRouter.post('/', asyncHandler(wikiController.create))
wikiRouter.put('/:slug', asyncHandler(wikiController.update))
wikiRouter.delete('/:slug', asyncHandler(wikiController.remove))
