import { prisma } from '../lib/prisma'

export async function awardXp(userId: string, amount: number, reason: string) {
  await prisma.$transaction([
    prisma.xpEvent.create({ data: { userId, amount, reason } }),
    prisma.user.update({ where: { id: userId }, data: { xp: { increment: amount } } }),
  ])
}
