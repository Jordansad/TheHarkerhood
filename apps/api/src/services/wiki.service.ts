import { prisma } from '../lib/prisma'
import { NotFoundError, ConflictError } from '../lib/errors'
import type { WikiPageDTO, WikiPageSummaryDTO } from '@hackerhood/types'
import type { WikiPage } from '@prisma/client'

function toSummaryDTO(page: Pick<WikiPage, 'id' | 'slug' | 'category' | 'title' | 'updatedAt'>): WikiPageSummaryDTO {
  return { id: page.id, slug: page.slug, category: page.category, title: page.title, updatedAt: page.updatedAt.toISOString() }
}

function toDTO(page: WikiPage): WikiPageDTO {
  return {
    id: page.id,
    slug: page.slug,
    category: page.category,
    title: page.title,
    content: page.content,
    updatedAt: page.updatedAt.toISOString(),
  }
}

const DIACRITICS_REGEX = new RegExp('[̀-ͯ]', 'g')

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function listPages(): Promise<WikiPageSummaryDTO[]> {
  const pages = await prisma.wikiPage.findMany({
    select: { id: true, slug: true, category: true, title: true, updatedAt: true },
    orderBy: [{ category: 'asc' }, { title: 'asc' }],
  })
  return pages.map(toSummaryDTO)
}

export async function getPageBySlug(slug: string): Promise<WikiPageDTO> {
  const page = await prisma.wikiPage.findUnique({ where: { slug } })
  if (!page) throw new NotFoundError('Page introuvable.')
  return toDTO(page)
}

export async function createPage(title: string, category: string, content: string) {
  const slug = slugify(title)
  const existing = await prisma.wikiPage.findUnique({ where: { slug } })
  if (existing) throw new ConflictError('Une page avec ce titre existe déjà.')

  const page = await prisma.wikiPage.create({ data: { slug, title, category, content } })
  return toDTO(page)
}

export async function updatePage(slug: string, title: string, category: string, content: string) {
  const existing = await prisma.wikiPage.findUnique({ where: { slug } })
  if (!existing) throw new NotFoundError('Page introuvable.')

  const page = await prisma.wikiPage.update({ where: { slug }, data: { title, category, content } })
  return toDTO(page)
}

export async function deletePage(slug: string) {
  const existing = await prisma.wikiPage.findUnique({ where: { slug } })
  if (!existing) throw new NotFoundError('Page introuvable.')
  await prisma.wikiPage.delete({ where: { slug } })
}
