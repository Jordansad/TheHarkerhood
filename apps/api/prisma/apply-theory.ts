import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import dns from 'dns'
import type { LookupFunction } from 'net'
import type { PoolConfig } from 'pg'
import { loadTheoryBySlug } from './seed-theory'

const lookupIPv4Only: LookupFunction = (hostname, options, callback) => dns.lookup(hostname, { family: 4 }, callback)

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, lookup: lookupIPv4Only } as PoolConfig)
const prisma = new PrismaClient({ adapter })

async function main() {
  const theory = loadTheoryBySlug()
  let updated = 0
  let missing = 0

  for (const [slug, content] of Object.entries(theory)) {
    try {
      await prisma.skill.update({
        where: { slug },
        data: { theoryContent: content, theoryPublished: true, theoryUpdatedAt: new Date() },
      })
      updated++
    } catch {
      console.warn(`Skill introuvable pour le slug "${slug}" — cours non appliqué.`)
      missing++
    }
  }

  console.log(`Cours théoriques appliqués : ${updated} mis à jour, ${missing} slug(s) introuvable(s).`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
