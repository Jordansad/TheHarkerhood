import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../lib/env'
import { UnauthorizedError } from '../lib/errors'

export const AUTH_COOKIE = 'hackerhood_token'

export interface AuthedRequest extends Request {
  userId?: string
}

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE]
  if (!token) return next(new UnauthorizedError())

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string }
    req.userId = payload.sub
    next()
  } catch {
    next(new UnauthorizedError('Session invalide ou expirée'))
  }
}
