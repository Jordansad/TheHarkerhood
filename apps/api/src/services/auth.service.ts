import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { env } from '../lib/env'
import { ConflictError, UnauthorizedError } from '../lib/errors'
import { computeTier } from '../lib/xp'
import type { User } from '@prisma/client'
import type { UserDTO } from '@hackerhood/types'

const TOKEN_TTL = '7d'

function toUserDTO(user: User): UserDTO {
  const { tier, label } = computeTier(user.xp)
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    xp: user.xp,
    tier,
    tierLabel: label,
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
  const role = env.adminEmails.includes(email.toLowerCase()) ? 'founder' : 'member'
  const user = await prisma.user.create({ data: { email, passwordHash, displayName, role } })
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
