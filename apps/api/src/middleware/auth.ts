import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../lib/env'
import { UnauthorizedError, ForbiddenError } from '../lib/errors'
import { prisma } from '../lib/prisma'
import type { UserRole } from '@prisma/client'

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

const QUIZ_MANAGER_ROLES: UserRole[] = ['founder', 'co_founder', 'training_manager']

export function requireQuizManager(req: AuthedRequest, _res: Response, next: NextFunction) {
  prisma.user
    .findUnique({ where: { id: req.userId! }, select: { role: true } })
    .then((user) => {
      if (!user || !QUIZ_MANAGER_ROLES.includes(user.role)) {
        return next(new ForbiddenError("Réservé aux responsables de formation."))
      }
      next()
    })
    .catch(next)
}

const ADMIN_ROLES: UserRole[] = ['founder', 'co_founder']

export function requireAdmin(req: AuthedRequest, _res: Response, next: NextFunction) {
  prisma.user
    .findUnique({ where: { id: req.userId! }, select: { role: true } })
    .then((user) => {
      if (!user || !ADMIN_ROLES.includes(user.role)) {
        return next(new ForbiddenError('Réservé aux fondateurs.'))
      }
      next()
    })
    .catch(next)
}
