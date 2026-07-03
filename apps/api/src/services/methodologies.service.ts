import { prisma } from '../lib/prisma'
import { NotFoundError } from '../lib/errors'
import type { MethodologyDTO } from '@hackerhood/types'
import { Prisma } from '@prisma/client'

const methodologyWithSteps = Prisma.validator<Prisma.MethodologyDefaultArgs>()({
  include: { steps: { orderBy: { order: 'asc' } } },
})
type MethodologyWithSteps = Prisma.MethodologyGetPayload<typeof methodologyWithSteps>

function toMethodologyDTO(methodology: MethodologyWithSteps, checkedStepIds: Set<string>): MethodologyDTO {
  const steps = methodology.steps.map((s) => ({
    id: s.id,
    order: s.order,
    title: s.title,
    description: s.description,
    checked: checkedStepIds.has(s.id),
  }))
  const progressPercent = steps.length === 0 ? 0 : Math.round((steps.filter((s) => s.checked).length / steps.length) * 100)

  return {
    id: methodology.id,
    slug: methodology.slug,
    title: methodology.title,
    category: methodology.category,
    objective: methodology.objective,
    preparation: methodology.preparation,
    tools: methodology.tools,
    bestPractices: methodology.bestPractices,
    commonMistakes: methodology.commonMistakes,
    deliverables: methodology.deliverables,
    position: methodology.position,
    steps,
    progressPercent,
  }
}

async function getCheckedStepIds(userId: string): Promise<Set<string>> {
  const rows = await prisma.userStepProgress.findMany({ where: { userId, checked: true }, select: { stepId: true } })
  return new Set(rows.map((r) => r.stepId))
}

export async function listMethodologies(userId: string): Promise<MethodologyDTO[]> {
  const [methodologies, checkedStepIds] = await Promise.all([
    prisma.methodology.findMany({ ...methodologyWithSteps, orderBy: { position: 'asc' } }),
    getCheckedStepIds(userId),
  ])
  return methodologies.map((m) => toMethodologyDTO(m, checkedStepIds))
}

export async function getMethodologyBySlug(userId: string, slug: string): Promise<MethodologyDTO> {
  const methodology = await prisma.methodology.findUnique({ where: { slug }, ...methodologyWithSteps })
  if (!methodology) throw new NotFoundError('Méthodologie introuvable.')

  const checkedStepIds = await getCheckedStepIds(userId)
  return toMethodologyDTO(methodology, checkedStepIds)
}

export async function setStepChecked(userId: string, stepId: string, checked: boolean): Promise<void> {
  const step = await prisma.methodologyStep.findUnique({ where: { id: stepId } })
  if (!step) throw new NotFoundError('Étape introuvable.')

  await prisma.userStepProgress.upsert({
    where: { userId_stepId: { userId, stepId } },
    create: { userId, stepId, checked, checkedAt: checked ? new Date() : null },
    update: { checked, checkedAt: checked ? new Date() : null },
  })
}
