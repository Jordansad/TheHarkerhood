import { prisma } from '../lib/prisma'
import { NotFoundError } from '../lib/errors'
import type { CtfCategoryDTO, CtfCompetitionDTO } from '@hackerhood/types'

export async function listCategories(): Promise<CtfCategoryDTO[]> {
  const categories = await prisma.ctfCategory.findMany({ orderBy: { position: 'asc' } })
  return categories
}

export async function getCategoryBySlug(slug: string): Promise<CtfCategoryDTO> {
  const category = await prisma.ctfCategory.findUnique({ where: { slug } })
  if (!category) throw new NotFoundError('Catégorie CTF introuvable.')
  return category
}

export async function listCompetitions(): Promise<CtfCompetitionDTO[]> {
  return prisma.ctfCompetition.findMany({ orderBy: { position: 'asc' } })
}
