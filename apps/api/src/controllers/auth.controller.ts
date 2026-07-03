import type { Response } from 'express'
import { z } from 'zod'
import * as authService from '../services/auth.service'
import { AUTH_COOKIE, type AuthedRequest } from '../middleware/auth'
import { BadRequestError } from '../lib/errors'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
  displayName: z.string().min(2).max(60),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// The web app and API are deployed on different domains (Vercel / Render), so the
// cookie must be sameSite=None + secure to be sent on cross-site requests in production.
const isProd = process.env.NODE_ENV === 'production'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
}

export async function register(req: AuthedRequest, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError(parsed.error.issues[0]?.message ?? 'Données invalides.')

  const { user, token } = await authService.register(parsed.data.email, parsed.data.password, parsed.data.displayName)
  res.cookie(AUTH_COOKIE, token, COOKIE_OPTIONS)
  res.status(201).json({ user })
}

export async function login(req: AuthedRequest, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) throw new BadRequestError('Email ou mot de passe invalide.')

  const { user, token } = await authService.login(parsed.data.email, parsed.data.password)
  res.cookie(AUTH_COOKIE, token, COOKIE_OPTIONS)
  res.json({ user })
}

export async function me(req: AuthedRequest, res: Response) {
  const user = await authService.getUserById(req.userId!)
  res.json({ user })
}

export async function logout(_req: AuthedRequest, res: Response) {
  res.clearCookie(AUTH_COOKIE, { httpOnly: true, secure: isProd, sameSite: COOKIE_OPTIONS.sameSite, path: '/' })
  res.status(204).send()
}
