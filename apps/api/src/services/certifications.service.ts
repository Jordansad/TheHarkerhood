import { prisma } from '../lib/prisma'
import type { CertificationDTO, CertificationStatus } from '@hackerhood/types'

export async function listCertifications(userId: string): Promise<CertificationDTO[]> {
  const [certifications, progressRows] = await Promise.all([
    prisma.certification.findMany({ orderBy: { position: 'asc' } }),
    prisma.userCertificationProgress.findMany({ where: { userId } }),
  ])

  const statusByCertId = new Map(progressRows.map((p) => [p.certificationId, p.status]))

  return certifications.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    level: c.level,
    notes: c.notes,
    position: c.position,
    status: statusByCertId.get(c.id) ?? 'planned',
  }))
}

export async function setCertificationStatus(userId: string, certificationId: string, status: CertificationStatus) {
  await prisma.userCertificationProgress.upsert({
    where: { userId_certificationId: { userId, certificationId } },
    create: { userId, certificationId, status },
    update: { status },
  })
  return listCertifications(userId)
}
