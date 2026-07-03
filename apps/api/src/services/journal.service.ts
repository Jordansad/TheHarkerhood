import { prisma } from '../lib/prisma'
import { NotFoundError } from '../lib/errors'
import type { JournalEntryDTO, JournalEntrySummaryDTO, JournalEntryType } from '@hackerhood/types'
import type { JournalEntry } from '@prisma/client'

function toSummaryDTO(entry: Pick<JournalEntry, 'id' | 'title' | 'type' | 'tags' | 'updatedAt'>): JournalEntrySummaryDTO {
  return { id: entry.id, title: entry.title, type: entry.type, tags: entry.tags, updatedAt: entry.updatedAt.toISOString() }
}

function toDTO(entry: JournalEntry): JournalEntryDTO {
  return {
    id: entry.id,
    title: entry.title,
    content: entry.content,
    type: entry.type,
    tags: entry.tags,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  }
}

export async function listEntries(userId: string): Promise<JournalEntrySummaryDTO[]> {
  const entries = await prisma.journalEntry.findMany({
    where: { userId },
    select: { id: true, title: true, type: true, tags: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  })
  return entries.map(toSummaryDTO)
}

export async function getEntry(userId: string, id: string): Promise<JournalEntryDTO> {
  const entry = await prisma.journalEntry.findFirst({ where: { id, userId } })
  if (!entry) throw new NotFoundError('Entrée introuvable.')
  return toDTO(entry)
}

export async function createEntry(userId: string, title: string, content: string, type: JournalEntryType, tags: string[]) {
  const entry = await prisma.journalEntry.create({ data: { userId, title, content, type, tags } })
  return toDTO(entry)
}

export async function updateEntry(userId: string, id: string, title: string, content: string, tags: string[]) {
  const existing = await prisma.journalEntry.findFirst({ where: { id, userId } })
  if (!existing) throw new NotFoundError('Entrée introuvable.')

  const entry = await prisma.journalEntry.update({ where: { id }, data: { title, content, tags } })
  return toDTO(entry)
}

export async function deleteEntry(userId: string, id: string) {
  const existing = await prisma.journalEntry.findFirst({ where: { id, userId } })
  if (!existing) throw new NotFoundError('Entrée introuvable.')
  await prisma.journalEntry.delete({ where: { id } })
}
