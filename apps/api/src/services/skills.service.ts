import { prisma } from '../lib/prisma'
import { NotFoundError } from '../lib/errors'
import type { SkillDTO, SkillProgressStatus, SkillTheoryEditDTO } from '@hackerhood/types'
import { Prisma } from '@prisma/client'
import { awardXp } from './xp.service'

const XP_BY_DIFFICULTY: Record<string, number> = {
  beginner: 50,
  intermediate: 100,
  advanced: 150,
  expert: 200,
}

// Lecture technique avec extraits de code : ~130 mots/min, arrondi à la minute supérieure.
const WORDS_PER_MINUTE = 130

function computeReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  if (words === 0) return 0
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

const skillWithRelations = Prisma.validator<Prisma.SkillDefaultArgs>()({
  include: { prerequisites: true, resources: true, labs: true },
})
type SkillWithRelations = Prisma.SkillGetPayload<typeof skillWithRelations>

function toSkillDTO(skill: SkillWithRelations, progress: SkillProgressStatus): SkillDTO {
  return {
    id: skill.id,
    slug: skill.slug,
    title: skill.title,
    description: skill.description,
    importance: skill.importance,
    category: skill.category,
    phase: skill.phase,
    difficulty: skill.difficulty,
    estimatedHours: skill.estimatedHours,
    position: skill.position,
    prerequisiteIds: skill.prerequisites.map((p) => p.id),
    resources: skill.resources.map((r) => ({ id: r.id, title: r.title, url: r.url, type: r.type })),
    labs: skill.labs.map((l) => ({ id: l.id, title: l.title, platform: l.platform, url: l.url, difficulty: l.difficulty })),
    progress,
    theoryContent: skill.theoryPublished ? skill.theoryContent : null,
    theoryPublished: skill.theoryPublished,
    theoryReadingMinutes: computeReadingMinutes(skill.theoryContent),
  }
}

export async function listSkills(userId: string): Promise<SkillDTO[]> {
  const [skills, progressRows] = await Promise.all([
    prisma.skill.findMany({ ...skillWithRelations, orderBy: { position: 'asc' } }),
    prisma.userSkillProgress.findMany({ where: { userId } }),
  ])

  const progressBySkillId = new Map(progressRows.map((p) => [p.skillId, p.status]))
  return skills.map((skill) => toSkillDTO(skill, progressBySkillId.get(skill.id) ?? 'not_started'))
}

export async function getSkillBySlug(userId: string, slug: string): Promise<SkillDTO> {
  const skill = await prisma.skill.findUnique({ where: { slug }, ...skillWithRelations })
  if (!skill) throw new NotFoundError('Compétence introuvable.')

  const progress = await prisma.userSkillProgress.findUnique({
    where: { userId_skillId: { userId, skillId: skill.id } },
  })
  return toSkillDTO(skill, progress?.status ?? 'not_started')
}

export async function setSkillProgress(userId: string, slug: string, status: SkillProgressStatus): Promise<SkillDTO> {
  const skill = await prisma.skill.findUnique({ where: { slug } })
  if (!skill) throw new NotFoundError('Compétence introuvable.')

  const existing = await prisma.userSkillProgress.findUnique({
    where: { userId_skillId: { userId, skillId: skill.id } },
  })

  await prisma.userSkillProgress.upsert({
    where: { userId_skillId: { userId, skillId: skill.id } },
    create: { userId, skillId: skill.id, status, completedAt: status === 'completed' ? new Date() : null },
    update: { status, completedAt: status === 'completed' ? new Date() : null },
  })

  const wasAlreadyCompleted = existing?.status === 'completed'
  if (status === 'completed' && !wasAlreadyCompleted) {
    await awardXp(userId, XP_BY_DIFFICULTY[skill.difficulty] ?? 50, `Compétence terminée : ${skill.title}`)
  }

  return getSkillBySlug(userId, slug)
}

function toTheoryEditDTO(skill: { id: string; slug: string; title: string; theoryContent: string; theoryPublished: boolean; theoryUpdatedAt: Date | null }): SkillTheoryEditDTO {
  return {
    id: skill.id,
    slug: skill.slug,
    title: skill.title,
    theoryContent: skill.theoryContent,
    theoryPublished: skill.theoryPublished,
    theoryUpdatedAt: skill.theoryUpdatedAt ? skill.theoryUpdatedAt.toISOString() : null,
    theoryReadingMinutes: computeReadingMinutes(skill.theoryContent),
  }
}

export async function getSkillTheoryForEdit(slug: string): Promise<SkillTheoryEditDTO> {
  const skill = await prisma.skill.findUnique({ where: { slug } })
  if (!skill) throw new NotFoundError('Compétence introuvable.')
  return toTheoryEditDTO(skill)
}

export async function updateSkillTheory(slug: string, theoryContent: string, theoryPublished: boolean): Promise<SkillTheoryEditDTO> {
  const skill = await prisma.skill.update({
    where: { slug },
    data: { theoryContent, theoryPublished, theoryUpdatedAt: new Date() },
  })
  return toTheoryEditDTO(skill)
}
