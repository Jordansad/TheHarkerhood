import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { env } from '../lib/env'
import { ConflictError, UnauthorizedError } from '../lib/errors'
import { computeLevel } from '../lib/xp'
import type { UserDTO } from '@cyberpath/types'

const TOKEN_TTL = '7d'

function toUserDTO(user: { id: string; email: string; displayName: string; xp: number; streakCount: number; createdAt: Date }): UserDTO {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    xp: user.xp,
    level: computeLevel(user.xp).level,
    streakCount: user.streakCount,
    createdAt: user.createdAt.toISOString(),
  }
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: TOKEN_TTL })
}

export async function register(email: string, password: string, displayName: string) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new ConflictError('Un compte existe déjà avec cet email.')

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({ data: { email, passwordHash, displayName } })
  return { user: toUserDTO(user), token: signToken(user.id) }
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new UnauthorizedError('Email ou mot de passe incorrect.')

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new UnauthorizedError('Email ou mot de passe incorrect.')

  return { user: toUserDTO(user), token: signToken(user.id) }
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  return toUserDTO(user)
}
